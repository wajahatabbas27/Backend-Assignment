import { Clinic } from './clinic.entity';
import { Appointment } from './appointment.entity';
import { AvailabilityBlock } from './availability-block.entity';
import { BillingRule } from './billing-rule.entity';
export declare class Physician {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialization: string;
    licenseNumber: string;
    defaultAppointmentDuration: number;
    isActive: boolean;
    clinic: Clinic;
    clinicId: string;
    appointments: Appointment[];
    availabilityBlocks: AvailabilityBlock[];
    billingRules: BillingRule[];
    createdAt: Date;
    updatedAt: Date;
}
