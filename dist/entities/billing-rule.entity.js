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
exports.BillingRule = exports.RuleType = void 0;
const typeorm_1 = require("typeorm");
const physician_entity_1 = require("./physician.entity");
var RuleType;
(function (RuleType) {
    RuleType["MINIMUM_GAP"] = "minimum_gap";
    RuleType["BUFFER_TIME"] = "buffer_time";
    RuleType["LUNCH_BREAK"] = "lunch_break";
    RuleType["BILLING_BLOCK"] = "billing_block";
})(RuleType || (exports.RuleType = RuleType = {}));
let BillingRule = class BillingRule {
    id;
    ruleType;
    name;
    description;
    durationMinutes;
    applicableStartTime;
    applicableEndTime;
    applicableDays;
    priority;
    isActive;
    physician;
    physicianId;
    createdAt;
    updatedAt;
};
exports.BillingRule = BillingRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BillingRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RuleType }),
    __metadata("design:type", String)
], BillingRule.prototype, "ruleType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], BillingRule.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BillingRule.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], BillingRule.prototype, "durationMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], BillingRule.prototype, "applicableStartTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], BillingRule.prototype, "applicableEndTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], BillingRule.prototype, "applicableDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], BillingRule.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], BillingRule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => physician_entity_1.Physician, physician => physician.billingRules),
    (0, typeorm_1.JoinColumn)({ name: 'physicianId' }),
    __metadata("design:type", physician_entity_1.Physician)
], BillingRule.prototype, "physician", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], BillingRule.prototype, "physicianId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BillingRule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BillingRule.prototype, "updatedAt", void 0);
exports.BillingRule = BillingRule = __decorate([
    (0, typeorm_1.Entity)('billing_rules')
], BillingRule);
//# sourceMappingURL=billing-rule.entity.js.map