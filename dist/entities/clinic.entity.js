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
exports.Clinic = void 0;
const typeorm_1 = require("typeorm");
const physician_entity_1 = require("./physician.entity");
const appointment_entity_1 = require("./appointment.entity");
let Clinic = class Clinic {
    id;
    name;
    address;
    phone;
    openTime;
    closeTime;
    operatingDays;
    isActive;
    physicians;
    appointments;
    createdAt;
    updatedAt;
};
exports.Clinic = Clinic;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Clinic.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Clinic.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Clinic.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Clinic.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Clinic.prototype, "openTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Clinic.prototype, "closeTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Clinic.prototype, "operatingDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Clinic.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => physician_entity_1.Physician, physician => physician.clinic),
    __metadata("design:type", Array)
], Clinic.prototype, "physicians", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => appointment_entity_1.Appointment, appointment => appointment.clinic),
    __metadata("design:type", Array)
], Clinic.prototype, "appointments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Clinic.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Clinic.prototype, "updatedAt", void 0);
exports.Clinic = Clinic = __decorate([
    (0, typeorm_1.Entity)('clinics')
], Clinic);
//# sourceMappingURL=clinic.entity.js.map