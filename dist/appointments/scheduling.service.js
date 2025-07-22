"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingService = void 0;
const common_1 = require("@nestjs/common");
const availability_block_entity_1 = require("../entities/availability-block.entity");
const billing_rule_entity_1 = require("../entities/billing-rule.entity");
let SchedulingService = class SchedulingService {
    async generateRecommendedSlots(context) {
        const potentialSlots = [];
        const dayOfWeek = context.searchDate.getDay();
        if (context.clinic.operatingDays && !context.clinic.operatingDays.includes(dayOfWeek)) {
            return [];
        }
        const clinicStartTime = this.parseTime(context.clinic.openTime, context.searchDate);
        const clinicEndTime = this.parseTime(context.clinic.closeTime, context.searchDate);
        let workingPeriods = [];
        if (context.availabilityBlocks.length === 0) {
            workingPeriods = [{
                    startTime: clinicStartTime,
                    endTime: clinicEndTime
                }];
        }
        else {
            workingPeriods = context.availabilityBlocks
                .filter(block => block.status === availability_block_entity_1.AvailabilityStatus.AVAILABLE)
                .map(block => ({
                startTime: block.startTime,
                endTime: block.endTime
            }));
        }
        for (const period of workingPeriods) {
            const slots = this.generateSlotsInPeriod(period.startTime, period.endTime, context.durationMinutes);
            potentialSlots.push(...slots);
        }
        const availableSlots = potentialSlots.filter(slot => !this.hasAppointmentConflict(slot, context.existingAppointments));
        const scoredSlots = availableSlots.map(slot => this.applyBillingRulesAndScore(slot, context));
        const topSlots = scoredSlots
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 10);
        return topSlots.map(slot => ({
            startTime: slot.startTime.toISOString(),
            endTime: slot.endTime.toISOString(),
            durationMinutes: context.durationMinutes,
            confidence: slot.confidence,
            conflicts: slot.conflicts
        }));
    }
    generateSlotsInPeriod(startTime, endTime, durationMinutes) {
        const slots = [];
        const slotDuration = durationMinutes * 60 * 1000;
        const current = new Date(startTime);
        while (current.getTime() + slotDuration <= endTime.getTime()) {
            const slotEnd = new Date(current.getTime() + slotDuration);
            slots.push({
                startTime: new Date(current),
                endTime: slotEnd,
                confidence: 100,
                conflicts: []
            });
            current.setMinutes(current.getMinutes() + 15);
        }
        return slots;
    }
    hasAppointmentConflict(slot, appointments) {
        return appointments.some(appointment => {
            const appointmentStart = appointment.startTime.getTime();
            const appointmentEnd = appointment.endTime.getTime();
            const slotStart = slot.startTime.getTime();
            const slotEnd = slot.endTime.getTime();
            return (slotStart < appointmentEnd && slotEnd > appointmentStart);
        });
    }
    applyBillingRulesAndScore(slot, context) {
        let confidence = 100;
        const conflicts = [];
        for (const rule of context.billingRules) {
            const ruleImpact = this.evaluateBillingRule(slot, rule, context);
            confidence -= ruleImpact.penalty;
            if (ruleImpact.conflict) {
                conflicts.push(ruleImpact.conflict);
            }
        }
        const proximityPenalty = this.calculateProximityPenalty(slot, context.existingAppointments);
        confidence -= proximityPenalty.penalty;
        if (proximityPenalty.conflict) {
            conflicts.push(proximityPenalty.conflict);
        }
        if (slot.startTime.getHours() < 12) {
            confidence += 5;
        }
        confidence = Math.max(0, Math.min(100, confidence));
        return {
            ...slot,
            confidence,
            conflicts
        };
    }
    evaluateBillingRule(slot, rule, context) {
        const dayOfWeek = context.searchDate.getDay();
        if (rule.applicableDays && !rule.applicableDays.includes(dayOfWeek)) {
            return { penalty: 0 };
        }
        switch (rule.ruleType) {
            case billing_rule_entity_1.RuleType.LUNCH_BREAK:
                return this.evaluateLunchBreakRule(slot, rule);
            case billing_rule_entity_1.RuleType.MINIMUM_GAP:
                return this.evaluateMinimumGapRule(slot, rule, context.existingAppointments);
            case billing_rule_entity_1.RuleType.BUFFER_TIME:
                return this.evaluateBufferTimeRule(slot, rule, context.existingAppointments);
            case billing_rule_entity_1.RuleType.BILLING_BLOCK:
                return this.evaluateBillingBlockRule(slot, rule);
            default:
                return { penalty: 0 };
        }
    }
    evaluateLunchBreakRule(slot, rule) {
        if (!rule.applicableStartTime || !rule.applicableEndTime) {
            return { penalty: 0 };
        }
        const lunchStart = this.parseTime(rule.applicableStartTime, slot.startTime);
        const lunchEnd = this.parseTime(rule.applicableEndTime, slot.startTime);
        if (slot.startTime.getTime() < lunchEnd.getTime() &&
            slot.endTime.getTime() > lunchStart.getTime()) {
            return {
                penalty: 50,
                conflict: `Conflicts with lunch break (${rule.applicableStartTime}-${rule.applicableEndTime})`
            };
        }
        return { penalty: 0 };
    }
    evaluateMinimumGapRule(slot, rule, appointments) {
        const requiredGapMs = rule.durationMinutes * 60 * 1000;
        for (const appointment of appointments) {
            const gapBefore = slot.startTime.getTime() - appointment.endTime.getTime();
            const gapAfter = appointment.startTime.getTime() - slot.endTime.getTime();
            if (gapBefore >= 0 && gapBefore < requiredGapMs) {
                return {
                    penalty: 30,
                    conflict: `Insufficient gap before appointment (${Math.round(gapBefore / 60000)} min < ${rule.durationMinutes} min required)`
                };
            }
            if (gapAfter >= 0 && gapAfter < requiredGapMs) {
                return {
                    penalty: 30,
                    conflict: `Insufficient gap after appointment (${Math.round(gapAfter / 60000)} min < ${rule.durationMinutes} min required)`
                };
            }
        }
        return { penalty: 0 };
    }
    evaluateBufferTimeRule(slot, rule, appointments) {
        const bufferMs = rule.durationMinutes * 60 * 1000;
        for (const appointment of appointments) {
            const gapBefore = slot.startTime.getTime() - appointment.endTime.getTime();
            const gapAfter = appointment.startTime.getTime() - slot.endTime.getTime();
            if ((gapBefore >= 0 && gapBefore < bufferMs) ||
                (gapAfter >= 0 && gapAfter < bufferMs)) {
                return {
                    penalty: 15,
                    conflict: `Preferred buffer time not met (${rule.durationMinutes} min)`
                };
            }
        }
        return { penalty: 0 };
    }
    evaluateBillingBlockRule(slot, rule) {
        if (rule.applicableStartTime && rule.applicableEndTime) {
            const blockStart = this.parseTime(rule.applicableStartTime, slot.startTime);
            const blockEnd = this.parseTime(rule.applicableEndTime, slot.startTime);
            if (slot.startTime.getTime() < blockEnd.getTime() &&
                slot.endTime.getTime() > blockStart.getTime()) {
                return {
                    penalty: 100,
                    conflict: `Conflicts with billing block (${rule.applicableStartTime}-${rule.applicableEndTime})`
                };
            }
        }
        return { penalty: 0 };
    }
    calculateProximityPenalty(slot, appointments) {
        const thirtyMinutes = 30 * 60 * 1000;
        for (const appointment of appointments) {
            const timeBefore = slot.startTime.getTime() - appointment.endTime.getTime();
            const timeAfter = appointment.startTime.getTime() - slot.endTime.getTime();
            if ((timeBefore >= 0 && timeBefore < thirtyMinutes) ||
                (timeAfter >= 0 && timeAfter < thirtyMinutes)) {
                return {
                    penalty: 10,
                    conflict: 'Close proximity to existing appointment may cause scheduling conflicts'
                };
            }
        }
        return { penalty: 0 };
    }
    parseTime(timeString, baseDate) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date(baseDate);
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
};
exports.SchedulingService = SchedulingService;
exports.SchedulingService = SchedulingService = __decorate([
    (0, common_1.Injectable)()
], SchedulingService);
//# sourceMappingURL=scheduling.service.js.map