import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Physician } from '../entities/physician.entity';
import { AvailabilityBlock } from '../entities/availability-block.entity';
import { BillingRule } from '../entities/billing-rule.entity';
import { Clinic } from '../entities/clinic.entity';
import { SchedulingService } from './scheduling.service';
import { AppointmentRecommendationRequestDto, AppointmentSlotDto } from './dto/appointment-recommendation.dto';
export interface RecommendationResult {
    slots: AppointmentSlotDto[];
}
export declare class AppointmentsService {
    private appointmentRepository;
    private physicianRepository;
    private availabilityRepository;
    private billingRuleRepository;
    private clinicRepository;
    private schedulingService;
    constructor(appointmentRepository: Repository<Appointment>, physicianRepository: Repository<Physician>, availabilityRepository: Repository<AvailabilityBlock>, billingRuleRepository: Repository<BillingRule>, clinicRepository: Repository<Clinic>, schedulingService: SchedulingService);
    recommendAppointmentSlots(request: AppointmentRecommendationRequestDto): Promise<RecommendationResult>;
}
