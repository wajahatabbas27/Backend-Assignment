export declare class AppointmentRecommendationRequestDto {
    clinicId: string;
    physicianId: string;
    patientId: string;
    preferredDate: string;
    durationMinutes: number;
    reasonForVisit?: string;
}
export declare class AppointmentSlotDto {
    startTime: string;
    endTime: string;
    durationMinutes: number;
    confidence: number;
    conflicts: string[];
}
export declare class AppointmentRecommendationResponseDto {
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
