import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Appointment } from './appointment.entity';

@Entity('patients')
export class Patient
{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    firstName: string;

    @Column({ length: 100 })
    lastName: string;

    @Column({ length: 100 })
    email: string;

    @Column({ length: 20 })
    phone: string;

    @Column({ type: 'date' })
    dateOfBirth: Date;

    @Column({ enum: ['male', 'female', 'other'] })
    gender: string;

    @Column({ length: 255, nullable: true })
    address: string;

    @Column({ length: 50, nullable: true })
    insuranceProvider: string;

    @Column({ length: 50, nullable: true })
    insurancePolicyNumber: string;

    @Column({ type: 'text', nullable: true })
    medicalHistory: string;

    @Column({ type: 'text', nullable: true })
    allergies: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Appointment, appointment => appointment.patient)
    appointments: Appointment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 