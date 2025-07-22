import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import
    {
        AppointmentRecommendationRequestDto,
        AppointmentRecommendationResponseDto
    } from './dto/appointment-recommendation.dto';

@Controller('api/appointments')
export class AppointmentsController
{
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post('recommend')
    async recommendSlots (
        @Body() requestDto: AppointmentRecommendationRequestDto
    ): Promise<AppointmentRecommendationResponseDto>
    {
        try
        {
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
        } catch (error)
        {
            throw new HttpException(
                {
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
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
} 