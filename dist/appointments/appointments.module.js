"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const appointments_controller_1 = require("./appointments.controller");
const appointments_service_1 = require("./appointments.service");
const scheduling_service_1 = require("./scheduling.service");
const appointment_entity_1 = require("../entities/appointment.entity");
const physician_entity_1 = require("../entities/physician.entity");
const patient_entity_1 = require("../entities/patient.entity");
const clinic_entity_1 = require("../entities/clinic.entity");
const availability_block_entity_1 = require("../entities/availability-block.entity");
const billing_rule_entity_1 = require("../entities/billing-rule.entity");
let AppointmentsModule = class AppointmentsModule {
};
exports.AppointmentsModule = AppointmentsModule;
exports.AppointmentsModule = AppointmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                appointment_entity_1.Appointment,
                physician_entity_1.Physician,
                patient_entity_1.Patient,
                clinic_entity_1.Clinic,
                availability_block_entity_1.AvailabilityBlock,
                billing_rule_entity_1.BillingRule
            ])
        ],
        controllers: [appointments_controller_1.AppointmentsController],
        providers: [appointments_service_1.AppointmentsService, scheduling_service_1.SchedulingService],
        exports: [appointments_service_1.AppointmentsService, scheduling_service_1.SchedulingService]
    })
], AppointmentsModule);
//# sourceMappingURL=appointments.module.js.map