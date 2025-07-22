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
exports.Physician = void 0;
const typeorm_1 = require("typeorm");
const clinic_entity_1 = require("./clinic.entity");
const appointment_entity_1 = require("./appointment.entity");
const availability_block_entity_1 = require("./availability-block.entity");
const billing_rule_entity_1 = require("./billing-rule.entity");
let Physician = class Physician {
    id;
    firstName;
    lastName;
    email;
    phone;
    specialization;
    licenseNumber;
    defaultAppointmentDuration;
    isActive;
    clinic;
    clinicId;
    appointments;
    availabilityBlocks;
    billingRules;
    createdAt;
    updatedAt;
};
exports.Physician = Physician;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Physician.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Physician.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Physician.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Physician.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Physician.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Physician.prototype, "specialization", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, unique: true }),
    __metadata("design:type", String)
], Physician.prototype, "licenseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 15 }),
    __metadata("design:type", Number)
], Physician.prototype, "defaultAppointmentDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Physician.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => clinic_entity_1.Clinic, clinic => clinic.physicians),
    (0, typeorm_1.JoinColumn)({ name: 'clinicId' }),
    __metadata("design:type", clinic_entity_1.Clinic)
], Physician.prototype, "clinic", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Physician.prototype, "clinicId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => appointment_entity_1.Appointment, appointment => appointment.physician),
    __metadata("design:type", Array)
], Physician.prototype, "appointments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => availability_block_entity_1.AvailabilityBlock, block => block.physician),
    __metadata("design:type", Array)
], Physician.prototype, "availabilityBlocks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => billing_rule_entity_1.BillingRule, rule => rule.physician),
    __metadata("design:type", Array)
], Physician.prototype, "billingRules", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Physician.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Physician.prototype, "updatedAt", void 0);
exports.Physician = Physician = __decorate([
    (0, typeorm_1.Entity)('physicians')
], Physician);
//# sourceMappingURL=physician.entity.js.map