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
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const appointments_service_1 = require("./appointments.service");
const appointment_recommendation_dto_1 = require("./dto/appointment-recommendation.dto");
let AppointmentsController = class AppointmentsController {
    appointmentsService;
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    async recommendSlots(requestDto) {
        try {
            const recommendations = await this.appointmentsService.recommendAppointmentSlots(requestDto);
            return {
                status: 'success',
                recommendedSlots: recommendations.slots,
                totalSlotsFound: recommendations.slots.length,
                searchCriteria: {
                    clinicId: requestDto.clinicId,
                    physicianId: requestDto.physicianId,
                    patientId: requestDto.patientId,
                    preferredDate: requestDto.preferredDate,
                    durationMinutes: requestDto.durationMinutes
                }
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: error.message || 'Failed to generate appointment recommendations',
                totalSlotsFound: 0,
                searchCriteria: {
                    clinicId: requestDto.clinicId,
                    physicianId: requestDto.physicianId,
                    patientId: requestDto.patientId,
                    preferredDate: requestDto.preferredDate,
                    durationMinutes: requestDto.durationMinutes
                }
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Post)('recommend'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [appointment_recommendation_dto_1.AppointmentRecommendationRequestDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "recommendSlots", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, common_1.Controller)('api/appointments'),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map