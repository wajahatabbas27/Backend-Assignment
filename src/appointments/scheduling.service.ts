import { Injectable } from '@nestjs/common';
import { Physician } from '../entities/physician.entity';
import { Clinic } from '../entities/clinic.entity';
import { Appointment } from '../entities/appointment.entity';
import { AvailabilityBlock, AvailabilityStatus } from '../entities/availability-block.entity';
import { BillingRule, RuleType } from '../entities/billing-rule.entity';
import { AppointmentSlotDto } from './dto/appointment-recommendation.dto';

export interface SchedulingContext
{
    physician: Physician;
    clinic: Clinic;
    searchDate: Date;
    durationMinutes: number;
    existingAppointments: Appointment[];
    availabilityBlocks: AvailabilityBlock[];
    billingRules: BillingRule[];
}

interface TimeSlot
{
    startTime: Date;
    endTime: Date;
    confidence: number;
    conflicts: string[];
}

@Injectable()
export class SchedulingService
{

    async generateRecommendedSlots (context: SchedulingContext): Promise<AppointmentSlotDto[]>
    {
        const potentialSlots: TimeSlot[] = [];

        // Generate all possible time slots for the day
        const dayOfWeek = context.searchDate.getDay();

        // Check if clinic is operating on this day
        if (context.clinic.operatingDays && !context.clinic.operatingDays.includes(dayOfWeek))
        {
            return []; // Clinic is closed on this day
        }

        // Get clinic operating hours
        const clinicStartTime = this.parseTime(context.clinic.openTime, context.searchDate);
        const clinicEndTime = this.parseTime(context.clinic.closeTime, context.searchDate);

        // If no availability blocks defined, use clinic hours as default availability
        let workingPeriods: { startTime: Date; endTime: Date }[] = [];

        if (context.availabilityBlocks.length === 0)
        {
            workingPeriods = [{
                startTime: clinicStartTime,
                endTime: clinicEndTime
            }];
        } else
        {
            // Use only available blocks
            workingPeriods = context.availabilityBlocks
                .filter(block => block.status === AvailabilityStatus.AVAILABLE)
                .map(block => ({
                    startTime: block.startTime,
                    endTime: block.endTime
                }));
        }

        // Generate potential slots within working periods
        for (const period of workingPeriods)
        {
            const slots = this.generateSlotsInPeriod(
                period.startTime,
                period.endTime,
                context.durationMinutes
            );
            potentialSlots.push(...slots);
        }

        // Filter out slots that conflict with existing appointments
        const availableSlots = potentialSlots.filter(slot =>
            !this.hasAppointmentConflict(slot, context.existingAppointments)
        );

        // Apply billing rules and calculate confidence scores
        const scoredSlots = availableSlots.map(slot =>
            this.applyBillingRulesAndScore(slot, context)
        );

        // Sort by confidence score (highest first) and take top 10
        const topSlots = scoredSlots
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 10);

        // Convert to DTOs
        return topSlots.map(slot => ({
            startTime: slot.startTime.toISOString(),
            endTime: slot.endTime.toISOString(),
            durationMinutes: context.durationMinutes,
            confidence: slot.confidence,
            conflicts: slot.conflicts
        }));
    }

    private generateSlotsInPeriod (
        startTime: Date,
        endTime: Date,
        durationMinutes: number
    ): TimeSlot[]
    {
        const slots: TimeSlot[] = [];
        const slotDuration = durationMinutes * 60 * 1000; // Convert to milliseconds
        const current = new Date(startTime);

        while (current.getTime() + slotDuration <= endTime.getTime())
        {
            const slotEnd = new Date(current.getTime() + slotDuration);

            slots.push({
                startTime: new Date(current),
                endTime: slotEnd,
                confidence: 100, // Base confidence, will be adjusted
                conflicts: []
            });

            // Move to next slot (15 minute intervals by default)
            current.setMinutes(current.getMinutes() + 15);
        }

        return slots;
    }

    private hasAppointmentConflict (slot: TimeSlot, appointments: Appointment[]): boolean
    {
        return appointments.some(appointment =>
        {
            const appointmentStart = appointment.startTime.getTime();
            const appointmentEnd = appointment.endTime.getTime();
            const slotStart = slot.startTime.getTime();
            const slotEnd = slot.endTime.getTime();

            // Check for any overlap
            return (slotStart < appointmentEnd && slotEnd > appointmentStart);
        });
    }

    private applyBillingRulesAndScore (slot: TimeSlot, context: SchedulingContext): TimeSlot
    {
        let confidence = 100;
        const conflicts: string[] = [];

        // Apply each billing rule
        for (const rule of context.billingRules)
        {
            const ruleImpact = this.evaluateBillingRule(slot, rule, context);
            confidence -= ruleImpact.penalty;
            if (ruleImpact.conflict)
            {
                conflicts.push(ruleImpact.conflict);
            }
        }

        // Check proximity to other appointments (avoid clustering)
        const proximityPenalty = this.calculateProximityPenalty(slot, context.existingAppointments);
        confidence -= proximityPenalty.penalty;
        if (proximityPenalty.conflict)
        {
            conflicts.push(proximityPenalty.conflict);
        }

        // Prefer morning slots (slightly higher confidence)
        if (slot.startTime.getHours() < 12)
        {
            confidence += 5;
        }

        // Ensure confidence doesn't go below 0 or above 100
        confidence = Math.max(0, Math.min(100, confidence));

        return {
            ...slot,
            confidence,
            conflicts
        };
    }

    private evaluateBillingRule (
        slot: TimeSlot,
        rule: BillingRule,
        context: SchedulingContext
    ): { penalty: number; conflict?: string }
    {
        const dayOfWeek = context.searchDate.getDay();

        // Check if rule applies to this day
        if (rule.applicableDays && !rule.applicableDays.includes(dayOfWeek))
        {
            return { penalty: 0 };
        }

        switch (rule.ruleType)
        {
            case RuleType.LUNCH_BREAK:
                return this.evaluateLunchBreakRule(slot, rule);

            case RuleType.MINIMUM_GAP:
                return this.evaluateMinimumGapRule(slot, rule, context.existingAppointments);

            case RuleType.BUFFER_TIME:
                return this.evaluateBufferTimeRule(slot, rule, context.existingAppointments);

            case RuleType.BILLING_BLOCK:
                return this.evaluateBillingBlockRule(slot, rule);

            default:
                return { penalty: 0 };
        }
    }

    private evaluateLunchBreakRule (slot: TimeSlot, rule: BillingRule): { penalty: number; conflict?: string }
    {
        if (!rule.applicableStartTime || !rule.applicableEndTime)
        {
            return { penalty: 0 };
        }

        const lunchStart = this.parseTime(rule.applicableStartTime, slot.startTime);
        const lunchEnd = this.parseTime(rule.applicableEndTime, slot.startTime);

        // Check if slot overlaps with lunch break
        if (slot.startTime.getTime() < lunchEnd.getTime() &&
            slot.endTime.getTime() > lunchStart.getTime())
        {
            return {
                penalty: 50,
                conflict: `Conflicts with lunch break (${rule.applicableStartTime}-${rule.applicableEndTime})`
            };
        }

        return { penalty: 0 };
    }

    private evaluateMinimumGapRule (
        slot: TimeSlot,
        rule: BillingRule,
        appointments: Appointment[]
    ): { penalty: number; conflict?: string }
    {
        const requiredGapMs = rule.durationMinutes * 60 * 1000;

        for (const appointment of appointments)
        {
            const gapBefore = slot.startTime.getTime() - appointment.endTime.getTime();
            const gapAfter = appointment.startTime.getTime() - slot.endTime.getTime();

            // Check gap before this slot
            if (gapBefore >= 0 && gapBefore < requiredGapMs)
            {
                return {
                    penalty: 30,
                    conflict: `Insufficient gap before appointment (${Math.round(gapBefore / 60000)} min < ${rule.durationMinutes} min required)`
                };
            }

            // Check gap after this slot
            if (gapAfter >= 0 && gapAfter < requiredGapMs)
            {
                return {
                    penalty: 30,
                    conflict: `Insufficient gap after appointment (${Math.round(gapAfter / 60000)} min < ${rule.durationMinutes} min required)`
                };
            }
        }

        return { penalty: 0 };
    }

    private evaluateBufferTimeRule (
        slot: TimeSlot,
        rule: BillingRule,
        appointments: Appointment[]
    ): { penalty: number; conflict?: string }
    {
        // Similar to minimum gap but with lower penalty (it's preferred, not required)
        const bufferMs = rule.durationMinutes * 60 * 1000;

        for (const appointment of appointments)
        {
            const gapBefore = slot.startTime.getTime() - appointment.endTime.getTime();
            const gapAfter = appointment.startTime.getTime() - slot.endTime.getTime();

            if ((gapBefore >= 0 && gapBefore < bufferMs) ||
                (gapAfter >= 0 && gapAfter < bufferMs))
            {
                return {
                    penalty: 15,
                    conflict: `Preferred buffer time not met (${rule.durationMinutes} min)`
                };
            }
        }

        return { penalty: 0 };
    }

    private evaluateBillingBlockRule (slot: TimeSlot, rule: BillingRule): { penalty: number; conflict?: string }
    {
        // This could be used for blocked time periods
        if (rule.applicableStartTime && rule.applicableEndTime)
        {
            const blockStart = this.parseTime(rule.applicableStartTime, slot.startTime);
            const blockEnd = this.parseTime(rule.applicableEndTime, slot.startTime);

            if (slot.startTime.getTime() < blockEnd.getTime() &&
                slot.endTime.getTime() > blockStart.getTime())
            {
                return {
                    penalty: 100, // High penalty, effectively blocks the slot
                    conflict: `Conflicts with billing block (${rule.applicableStartTime}-${rule.applicableEndTime})`
                };
            }
        }

        return { penalty: 0 };
    }

    private calculateProximityPenalty (
        slot: TimeSlot,
        appointments: Appointment[]
    ): { penalty: number; conflict?: string }
    {
        const thirtyMinutes = 30 * 60 * 1000;

        for (const appointment of appointments)
        {
            const timeBefore = slot.startTime.getTime() - appointment.endTime.getTime();
            const timeAfter = appointment.startTime.getTime() - slot.endTime.getTime();

            // Penalize slots too close to existing appointments (but not overlapping)
            if ((timeBefore >= 0 && timeBefore < thirtyMinutes) ||
                (timeAfter >= 0 && timeAfter < thirtyMinutes))
            {
                return {
                    penalty: 10,
                    conflict: 'Close proximity to existing appointment may cause scheduling conflicts'
                };
            }
        }

        return { penalty: 0 };
    }

    private parseTime (timeString: string, baseDate: Date): Date
    {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date(baseDate);
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
} 