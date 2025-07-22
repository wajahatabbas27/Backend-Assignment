"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("../entities/appointment.entity");
const physician_entity_1 = require("../entities/physician.entity");
const availability_block_entity_1 = require("../entities/availability-block.entity");
const billing_rule_entity_1 = require("../entities/billing-rule.entity");
const clinic_entity_1 = require("../entities/clinic.entity");
const scheduling_service_1 = require("./scheduling.service");
let AppointmentsService = class AppointmentsService {
    appointmentRepository;
    physicianRepository;
    availabilityRepository;
    billingRuleRepository;
    clinicRepository;
    schedulingService;
    constructor(appointmentRepository, physicianRepository, availabilityRepository, billingRuleRepository, clinicRepository, schedulingService) {
        this.appointmentRepository = appointmentRepository;
        this.physicianRepository = physicianRepository;
        this.availabilityRepository = availabilityRepository;
        this.billingRuleRepository = billingRuleRepository;
        this.clinicRepository = clinicRepository;
        this.schedulingService = schedulingService;
    }
    async recommendAppointmentSlots(request) {
        const physician = await this.physicianRepository.findOne({
            where: { id: request.physicianId, isActive: true },
            relations: ['clinic']
        });
        if (!physician) {
            throw new Error('Physician not found or inactive');
        }
        if (physician.clinicId !== request.clinicId) {
            throw new Error('Physician does not belong to the specified clinic');
        }
        const clinic = await this.clinicRepository.findOne({
            where: { id: request.clinicId, isActive: true }
        });
        if (!clinic) {
            throw new Error('Clinic not found or inactive');
        }
        const searchDate = new Date(request.preferredDate);
        const startOfDay = new Date(searchDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(searchDate);
        endOfDay.setHours(23, 59, 59, 999);
        const existingAppointments = await this.appointmentRepository.find({
            where: {
                physicianId: request.physicianId,
                startTime: (0, typeorm_2.Between)(startOfDay, endOfDay),
                status: (0, typeorm_2.In)([appointment_entity_1.AppointmentStatus.SCHEDULED, appointment_entity_1.AppointmentStatus.CONFIRMED])
            },
            order: { startTime: 'ASC' }
        });
        const availabilityBlocks = await this.availabilityRepository.find({
            where: {
                physicianId: request.physicianId,
                startTime: (0, typeorm_2.Between)(startOfDay, endOfDay),
                status: availability_block_entity_1.AvailabilityStatus.AVAILABLE,
                isActive: true
            },
            order: { startTime: 'ASC' }
        });
        const billingRules = await this.billingRuleRepository.find({
            where: {
                physicianId: request.physicianId,
                isActive: true
            },
            order: { priority: 'DESC' }
        });
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
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __param(1, (0, typeorm_1.InjectRepository)(physician_entity_1.Physician)),
    __param(2, (0, typeorm_1.InjectRepository)(availability_block_entity_1.AvailabilityBlock)),
    __param(3, (0, typeorm_1.InjectRepository)(billing_rule_entity_1.BillingRule)),
    __param(4, (0, typeorm_1.InjectRepository)(clinic_entity_1.Clinic)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        scheduling_service_1.SchedulingService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map