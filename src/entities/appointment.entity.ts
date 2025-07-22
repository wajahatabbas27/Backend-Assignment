import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Physician } from './physician.entity';
import { Patient } from './patient.entity';
import { Clinic } from './clinic.entity';

export enum AppointmentStatus
{
    SCHEDULED = 'scheduled',
    CONFIRMED = 'confirmed',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show'
}

export enum AppointmentType
{
    CONSULTATION = 'consultation',
    FOLLOW_UP = 'follow_up',
    PROCEDURE = 'procedure',
    EMERGENCY = 'emergency'
}

@Entity('appointments')
export class Appointment
{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp' })
    endTime: Date;

    @Column({ type: 'int' })
    durationMinutes: number;

    @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.SCHEDULED })
    status: AppointmentStatus;

    @Column({ type: 'enum', enum: AppointmentType, default: AppointmentType.CONSULTATION })
    type: AppointmentType;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'text', nullable: true })
    reasonForVisit: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    billingAmount: number;

    @ManyToOne(() => Physician, physician => physician.appointments)
    @JoinColumn({ name: 'physicianId' })
    physician: Physician;

    @Column('uuid')
    physicianId: string;

    @ManyToOne(() => Patient, patient => patient.appointments)
    @JoinColumn({ name: 'patientId' })
    patient: Patient;

    @Column('uuid')
    patientId: string;

    @ManyToOne(() => Clinic, clinic => clinic.appointments)
    @JoinColumn({ name: 'clinicId' })
    clinic: Clinic;

    @Column('uuid')
    clinicId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 