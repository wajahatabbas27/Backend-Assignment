import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { SchedulingService } from './scheduling.service';
import { Appointment } from '../entities/appointment.entity';
import { Physician } from '../entities/physician.entity';
import { Patient } from '../entities/patient.entity';
import { Clinic } from '../entities/clinic.entity';
import { AvailabilityBlock } from '../entities/availability-block.entity';
import { BillingRule } from '../entities/billing-rule.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Appointment,
            Physician,
            Patient,
            Clinic,
            AvailabilityBlock,
            BillingRule
        ])
    ],
    controllers: [AppointmentsController],
    providers: [AppointmentsService, SchedulingService],
    exports: [AppointmentsService, SchedulingService]
})
export class AppointmentsModule { } 