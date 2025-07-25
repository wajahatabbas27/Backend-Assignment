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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRecommendationResponseDto = exports.AppointmentSlotDto = exports.AppointmentRecommendationRequestDto = void 0;
const class_validator_1 = require("class-validator");
class AppointmentRecommendationRequestDto {
    clinicId;
    physicianId;
    patientId;
    preferredDate;
    durationMinutes;
    reasonForVisit;
}
exports.AppointmentRecommendationRequestDto = AppointmentRecommendationRequestDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AppointmentRecommendationRequestDto.prototype, "clinicId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AppointmentRecommendationRequestDto.prototype, "physicianId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AppointmentRecommendationRequestDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AppointmentRecommendationRequestDto.prototype, "preferredDate", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(15),
    (0, class_validator_1.Max)(240),
    __metadata("design:type", Number)
], AppointmentRecommendationRequestDto.prototype, "durationMinutes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppointmentRecommendationRequestDto.prototype, "reasonForVisit", void 0);
class AppointmentSlotDto {
    startTime;
    endTime;
    durationMinutes;
    confidence;
    conflicts;
}
exports.AppointmentSlotDto = AppointmentSlotDto;
class AppointmentRecommendationResponseDto {
    status;
    message;
    recommendedSlots;
    totalSlotsFound;
    searchCriteria;
}
exports.AppointmentRecommendationResponseDto = AppointmentRecommendationResponseDto;
//# sourceMappingURL=appointment-recommendation.dto.js.map