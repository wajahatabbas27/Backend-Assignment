import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { Physician } from '../entities/physician.entity';
import { AvailabilityBlock, AvailabilityStatus } from '../entities/availability-block.entity';
import { BillingRule } from '../entities/billing-rule.entity';
import { Clinic } from '../entities/clinic.entity';
import { SchedulingService } from './scheduling.service';
import
    {
        AppointmentRecommendationRequestDto,
        AppointmentSlotDto
    } from './dto/appointment-recommendation.dto';

export interface RecommendationResult
{
    slots: AppointmentSlotDto[];
}

@Injectable()
export class AppointmentsService
{
    constructor(
        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
        @InjectRepository(Physician)
        private physicianRepository: Repository<Physician>,
        @InjectRepository(AvailabilityBlock)
        private availabilityRepository: Repository<AvailabilityBlock>,
        @InjectRepository(BillingRule)
        private billingRuleRepository: Repository<BillingRule>,
        @InjectRepository(Clinic)
        private clinicRepository: Repository<Clinic>,
        private schedulingService: SchedulingService
    ) { }

    async recommendAppointmentSlots (
        request: AppointmentRecommendationRequestDto
    ): Promise<RecommendationResult>
    {
        // Validate physician exists and is active
        const physician = await this.physicianRepository.findOne({
            where: { id: request.physicianId, isActive: true },
            relations: ['clinic']
        });

        if (!physician)
        {
            throw new Error('Physician not found or inactive');
        }

        if (physician.clinicId !== request.clinicId)
        {
            throw new Error('Physician does not belong to the specified clinic');
        }

        // Validate clinic is active
        const clinic = await this.clinicRepository.findOne({
            where: { id: request.clinicId, isActive: true }
        });

        if (!clinic)
        {
            throw new Error('Clinic not found or inactive');
        }

        // Get the date range for the search (search the preferred date)
        const searchDate = new Date(request.preferredDate);
        const startOfDay = new Date(searchDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(searchDate);
        endOfDay.setHours(23, 59, 59, 999);

            // Get existing appointments for the physician on the requested date
    const existingAppointments = await this.appointmentRepository.find({
      where: {
        physicianId: request.physicianId,
        startTime: Between(startOfDay, endOfDay),
        status: In([AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED])
      },
      order: { startTime: 'ASC' }
    });

    // Get availability blocks for the physician on the requested date
    const availabilityBlocks = await this.availabilityRepository.find({
      where: {
        physicianId: request.physicianId,
        startTime: Between(startOfDay, endOfDay),
        status: AvailabilityStatus.AVAILABLE,
        isActive: true
      },
      order: { startTime: 'ASC' }
    });

        // Get billing rules for the physician
        const billingRules = await this.billingRuleRepository.find({
            where: {
                physicianId: request.physicianId,
                isActive: true
            },
            order: { priority: 'DESC' }
        });

        // Use scheduling service to generate recommendations
        const slots = await this.schedulingService.generateRecommendedSlots({
            physician,
            clinic,
            searchDate,
            durationMinutes: request.durationMinutes,
            existingAppointments,
            availabilityBlocks,
            billingRules
        });

        return { slots };
    }
} 