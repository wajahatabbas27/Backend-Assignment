import { Physician } from '../entities/physician.entity';
import { Clinic } from '../entities/clinic.entity';
import { Appointment } from '../entities/appointment.entity';
import { AvailabilityBlock } from '../entities/availability-block.entity';
import { BillingRule } from '../entities/billing-rule.entity';
import { AppointmentSlotDto } from './dto/appointment-recommendation.dto';
export interface SchedulingContext {
    physician: Physician;
    clinic: Clinic;
    searchDate: Date;
    durationMinutes: number;
    existingAppointments: Appointment[];
    availabilityBlocks: AvailabilityBlock[];
    billingRules: BillingRule[];
}
export declare class SchedulingService {
    generateRecommendedSlots(context: SchedulingContext): Promise<AppointmentSlotDto[]>;
    private generateSlotsInPeriod;
    private hasAppointmentConflict;
    private applyBillingRulesAndScore;
    private evaluateBillingRule;
    private evaluateLunchBreakRule;
    private evaluateMinimumGapRule;
    private evaluateBufferTimeRule;
    private evaluateBillingBlockRule;
    private calculateProximityPenalty;
    private parseTime;
}
