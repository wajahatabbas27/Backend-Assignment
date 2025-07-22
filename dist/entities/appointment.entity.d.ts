import { Physician } from './physician.entity';
import { Patient } from './patient.entity';
import { Clinic } from './clinic.entity';
export declare enum AppointmentStatus {
    SCHEDULED = "scheduled",
    CONFIRMED = "confirmed",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    NO_SHOW = "no_show"
}
export declare enum AppointmentType {
    CONSULTATION = "consultation",
    FOLLOW_UP = "follow_up",
    PROCEDURE = "procedure",
    EMERGENCY = "emergency"
}
export declare class Appointment {
    id: string;
    startTime: Date;
    endTime: Date;
    durationMinutes: number;
    status: AppointmentStatus;
    type: AppointmentType;
    notes: string;
    reasonForVisit: string;
    billingAmount: number;
    physician: Physician;
    physicianId: string;
    patient: Patient;
    patientId: string;
    clinic: Clinic;
    clinicId: string;
    createdAt: Date;
    updatedAt: Date;
}
