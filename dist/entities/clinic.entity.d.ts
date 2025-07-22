import { Physician } from './physician.entity';
import { Appointment } from './appointment.entity';
export declare class Clinic {
    id: string;
    name: string;
    address: string;
    phone: string;
    openTime: string;
    closeTime: string;
    operatingDays: number[];
    isActive: boolean;
    physicians: Physician[];
    appointments: Appointment[];
    createdAt: Date;
    updatedAt: Date;
}
