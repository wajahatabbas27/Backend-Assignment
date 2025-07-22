import { AppointmentsService } from './appointments.service';
import { AppointmentRecommendationRequestDto, AppointmentRecommendationResponseDto } from './dto/appointment-recommendation.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    recommendSlots(requestDto: AppointmentRecommendationRequestDto): Promise<AppointmentRecommendationResponseDto>;
}
