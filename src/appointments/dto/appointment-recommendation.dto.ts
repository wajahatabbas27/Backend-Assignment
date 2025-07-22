import { IsString, IsUUID, IsDateString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class AppointmentRecommendationRequestDto
{
    @IsUUID()
    clinicId: string;

    @IsUUID()
    physicianId: string;

    @IsUUID()
    patientId: string;

    @IsDateString()
    preferredDate: string;

    @IsInt()
    @Min(15)
    @Max(240)
    durationMinutes: number;

    @IsOptional()
    @IsString()
    reasonForVisit?: string;
}

export class AppointmentSlotDto
{
    startTime: string;
    endTime: string;
    durationMinutes: number;
    confidence: number; // Score indicating how optimal this slot is (0-100)
    conflicts: string[]; // Any potential issues or conflicts
}

export class AppointmentRecommendationResponseDto
{
    status: 'success' | 'error';
    message?: string;
    recommendedSlots?: AppointmentSlotDto[];
    totalSlotsFound: number;
    searchCriteria: {
        clinicId: string;
        physicianId: string;
        patientId: string;
        preferredDate: string;
        durationMinutes: number;
    };
} 