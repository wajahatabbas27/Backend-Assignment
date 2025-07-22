import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Physician } from './physician.entity';

export enum RuleType
{
    MINIMUM_GAP = 'minimum_gap',
    BUFFER_TIME = 'buffer_time',
    LUNCH_BREAK = 'lunch_break',
    BILLING_BLOCK = 'billing_block'
}

@Entity('billing_rules')
export class BillingRule
{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: RuleType })
    ruleType: RuleType;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'int' })
    durationMinutes: number; // Duration of the gap/buffer

    @Column({ type: 'time', nullable: true })
    applicableStartTime: string; // e.g., "12:00" for lunch break

    @Column({ type: 'time', nullable: true })
    applicableEndTime: string; // e.g., "13:00" for lunch break

    @Column({ type: 'json', nullable: true })
    applicableDays: number[]; // Days of week when rule applies [1,2,3,4,5] for weekdays

    @Column({ type: 'int', default: 1 })
    priority: number; // Higher number = higher priority

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Physician, physician => physician.billingRules)
    @JoinColumn({ name: 'physicianId' })
    physician: Physician;

    @Column('uuid')
    physicianId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 