import { Appointment } from './appointment.entity';
export declare class Patient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
    address: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    medicalHistory: string;
    allergies: string;
    isActive: boolean;
    appointments: Appointment[];
    createdAt: Date;
    updatedAt: Date;
}
