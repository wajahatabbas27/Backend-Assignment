import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Physician } from './physician.entity';
import { Appointment } from './appointment.entity';

@Entity('clinics')
export class Clinic
{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 255 })
    address: string;

    @Column({ length: 20 })
    phone: string;

    @Column({ type: 'time' })
    openTime: string;

    @Column({ type: 'time' })
    closeTime: string;

    @Column({ type: 'json', nullable: true })
    operatingDays: number[]; // 0=Sunday, 1=Monday, etc.

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Physician, physician => physician.clinic)
    physicians: Physician[];

    @OneToMany(() => Appointment, appointment => appointment.clinic)
    appointments: Appointment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 