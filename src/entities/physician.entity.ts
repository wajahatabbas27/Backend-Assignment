import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Clinic } from './clinic.entity';
import { Appointment } from './appointment.entity';
import { AvailabilityBlock } from './availability-block.entity';
import { BillingRule } from './billing-rule.entity';

@Entity('physicians')
export class Physician
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

    @Column({ length: 50 })
    specialization: string;

    @Column({ length: 50, unique: true })
    licenseNumber: string;

    @Column({ type: 'int', default: 15 })
    defaultAppointmentDuration: number; // minutes

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Clinic, clinic => clinic.physicians)
    @JoinColumn({ name: 'clinicId' })
    clinic: Clinic;

    @Column('uuid')
    clinicId: string;

    @OneToMany(() => Appointment, appointment => appointment.physician)
    appointments: Appointment[];

    @OneToMany(() => AvailabilityBlock, block => block.physician)
    availabilityBlocks: AvailabilityBlock[];

    @OneToMany(() => BillingRule, rule => rule.physician)
    billingRules: BillingRule[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 