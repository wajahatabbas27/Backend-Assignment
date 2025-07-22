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
exports.AvailabilityBlock = exports.AvailabilityStatus = exports.RecurrenceType = void 0;
const typeorm_1 = require("typeorm");
const physician_entity_1 = require("./physician.entity");
var RecurrenceType;
(function (RecurrenceType) {
    RecurrenceType["NONE"] = "none";
    RecurrenceType["DAILY"] = "daily";
    RecurrenceType["WEEKLY"] = "weekly";
    RecurrenceType["MONTHLY"] = "monthly";
})(RecurrenceType || (exports.RecurrenceType = RecurrenceType = {}));
var AvailabilityStatus;
(function (AvailabilityStatus) {
    AvailabilityStatus["AVAILABLE"] = "available";
    AvailabilityStatus["UNAVAILABLE"] = "unavailable";
    AvailabilityStatus["BREAK"] = "break";
    AvailabilityStatus["BUSY"] = "busy";
})(AvailabilityStatus || (exports.AvailabilityStatus = AvailabilityStatus = {}));
let AvailabilityBlock = class AvailabilityBlock {
    id;
    startTime;
    endTime;
    status;
    recurrenceType;
    recurrenceInterval;
    recurrenceEndDate;
    notes;
    isActive;
    physician;
    physicianId;
    createdAt;
    updatedAt;
};
exports.AvailabilityBlock = AvailabilityBlock;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AvailabilityBlock.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], AvailabilityBlock.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], AvailabilityBlock.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AvailabilityStatus, default: AvailabilityStatus.AVAILABLE }),
    __metadata("design:type", String)
], AvailabilityBlock.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RecurrenceType, default: RecurrenceType.NONE }),
    __metadata("design:type", String)
], AvailabilityBlock.prototype, "recurrenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AvailabilityBlock.prototype, "recurrenceInterval", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], AvailabilityBlock.prototype, "recurrenceEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AvailabilityBlock.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], AvailabilityBlock.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => physician_entity_1.Physician, physician => physician.availabilityBlocks),
    (0, typeorm_1.JoinColumn)({ name: 'physicianId' }),
    __metadata("design:type", physician_entity_1.Physician)
], AvailabilityBlock.prototype, "physician", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], AvailabilityBlock.prototype, "physicianId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AvailabilityBlock.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AvailabilityBlock.prototype, "updatedAt", void 0);
exports.AvailabilityBlock = AvailabilityBlock = __decorate([
    (0, typeorm_1.Entity)('availability_blocks')
], AvailabilityBlock);
//# sourceMappingURL=availability-block.entity.js.map