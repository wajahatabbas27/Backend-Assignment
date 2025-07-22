import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Physician } from './physician.entity';

export enum RecurrenceType
{
    NONE = 'none',
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly'
}

export enum AvailabilityStatus
{
    AVAILABLE = 'available',
    UNAVAILABLE = 'unavailable',
    BREAK = 'break',
    BUSY = 'busy'
}

@Entity('availability_blocks')
export class AvailabilityBlock
{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp' })
    endTime: Date;

    @Column({ type: 'enum', enum: AvailabilityStatus, default: AvailabilityStatus.AVAILABLE })
    status: AvailabilityStatus;

    @Column({ type: 'enum', enum: RecurrenceType, default: RecurrenceType.NONE })
    recurrenceType: RecurrenceType;

    @Column({ type: 'int', nullable: true })
    recurrenceInterval: number; // For weekly: 1=every week, 2=every 2 weeks

    @Column({ type: 'date', nullable: true })
    recurrenceEndDate: Date;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Physician, physician => physician.availabilityBlocks)
    @JoinColumn({ name: 'physicianId' })
    physician: Physician;

    @Column('uuid')
    physicianId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 