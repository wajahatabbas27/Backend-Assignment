import { Physician } from './physician.entity';
export declare enum RecurrenceType {
    NONE = "none",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly"
}
export declare enum AvailabilityStatus {
    AVAILABLE = "available",
    UNAVAILABLE = "unavailable",
    BREAK = "break",
    BUSY = "busy"
}
export declare class AvailabilityBlock {
    id: string;
    startTime: Date;
    endTime: Date;
    status: AvailabilityStatus;
    recurrenceType: RecurrenceType;
    recurrenceInterval: number;
    recurrenceEndDate: Date;
    notes: string;
    isActive: boolean;
    physician: Physician;
    physicianId: string;
    createdAt: Date;
    updatedAt: Date;
}
