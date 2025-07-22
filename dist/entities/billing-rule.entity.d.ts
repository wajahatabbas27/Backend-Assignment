import { Physician } from './physician.entity';
export declare enum RuleType {
    MINIMUM_GAP = "minimum_gap",
    BUFFER_TIME = "buffer_time",
    LUNCH_BREAK = "lunch_break",
    BILLING_BLOCK = "billing_block"
}
export declare class BillingRule {
    id: string;
    ruleType: RuleType;
    name: string;
    description: string;
    durationMinutes: number;
    applicableStartTime: string;
    applicableEndTime: string;
    applicableDays: number[];
    priority: number;
    isActive: boolean;
    physician: Physician;
    physicianId: string;
    createdAt: Date;
    updatedAt: Date;
}
