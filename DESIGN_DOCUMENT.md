# Healthcare Appointment Scheduling System - Design Document

## Overview
This document describes the design and implementation of a healthcare appointment scheduling system built with NestJS and PostgreSQL. The system provides intelligent slot recommendations considering physician availability, existing appointments, billing rules, and gap management.

## System Architecture

### Technology Stack
- **Backend Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Validation**: class-validator, class-transformer
- **Language**: TypeScript

### Core Modules
- **Entities Module**: Database entities and relationships
- **Appointments Module**: Core scheduling logic and API endpoints
- **Scheduling Service**: Algorithm for slot recommendations

## Entity Relationship Diagram (ERD)

![Entity Relationship Diagram](erd.png)

*Figure: ERD showing the relationships between clinics, physicians, patients, appointments, availability blocks, and billing rules.*

### ERD Explanation
- **CLINICS**: Represents healthcare facilities. Each clinic can have multiple physicians and defines its own operating hours.
- **PHYSICIANS**: Belongs to a clinic. Each physician has working hours (availability blocks), can have multiple appointments, and is subject to billing rules.
- **PATIENTS**: Can book appointments with any physician. Stores patient details and contact information.
- **APPOINTMENTS**: Links physicians, patients, and clinics. Stores appointment timing, type, status, and notes.
- **AVAILABILITY_BLOCKS**: Defines when physicians are available or unavailable (e.g., working hours, breaks). Used to generate possible appointment slots.
- **BILLING_RULES**: Defines rules such as minimum gaps, buffer times, lunch breaks, and billing blocks for each clinic/physician.

Relationships:
- A clinic **has** many physicians.
- A physician **has** many availability blocks and appointments.
- A patient **books** many appointments.
- Appointments **link** clinics, physicians, and patients.
- Billing rules are **defined** per clinic and **hosted** by physicians.

---

## Key APIs (Input/Output)

### 1. Recommend Appointment Slots
- **POST** `/api/appointments/recommend`
- **Input:**
  ```json
  {
    "clinicId": "<uuid>",
    "physicianId": "<uuid>",
    "patientId": "<uuid>",
    "preferredDate": "YYYY-MM-DD",
    "durationMinutes": 15
  }
  ```
- **Output:**
  ```json
  {
    "status": "success",
    "recommendedSlots": [
      {
        "startTime": "2025-07-01T09:00:00.000Z",
        "endTime": "2025-07-01T09:15:00.000Z",
        "durationMinutes": 15,
        "confidence": 100,
        "conflicts": []
      }
      // ... up to 10 slots
    ],
    "totalSlotsFound": 10,
    "searchCriteria": {
      "clinicId": "...",
      "physicianId": "...",
      "patientId": "...",
      "preferredDate": "...",
      "durationMinutes": 15
    }
  }
  ```

---

## Scheduling Algorithm Logic Flow

1. **Validation**
   - Check if physician, clinic, and patient exist and are active.
   - Ensure physician belongs to the specified clinic.
2. **Data Collection**
   - Retrieve existing appointments for the physician on the preferred date.
   - Get physician's availability blocks for that date.
   - Fetch applicable billing rules.
3. **Slot Generation**
   - Generate all possible time slots within working/available periods (default 15-minute intervals).
   - Use clinic hours if no availability blocks are defined.
4. **Conflict Filtering**
   - Remove slots that overlap with existing appointments.
5. **Apply Billing Rules & Scoring**
   - Apply rules for minimum gaps, buffer times, lunch breaks, and billing blocks.
   - Score each slot based on rule compliance, proximity to other appointments, and time-of-day preferences.
6. **Ranking & Output**
   - Sort slots by confidence score (highest first).
   - Return the top 10 recommended slots.

---

## Handling Gaps and Slot Recommendations

- **Minimum Gaps**: Enforced between appointments as per billing rules (e.g., 10-15 minutes for cleaning/setup).
- **Buffer Times**: Preferred (but not mandatory) gaps, with lower penalty if not met.
- **Lunch Breaks & Billing Blocks**: Slots overlapping these periods are penalized or blocked.
- **Clustering Avoidance**: Slots too close to other appointments are penalized to avoid back-to-back bookings.
- **Least Disruptive Slots**: Morning slots and those with fewer conflicts are prioritized.
- **Scoring**: Each slot receives a confidence score based on all the above factors, and only the best slots are recommended.

---

## Database Schema Details

### Key Entities

#### Clinic
- Manages multiple physicians and appointment scheduling
- Contains operating hours and days
- Supports multi-clinic architecture

#### Physician
- Belongs to one clinic
- Has availability blocks and billing rules
- Manages appointments and scheduling preferences

#### Patient
- Can book appointments with any physician
- Contains medical history and insurance information

#### Appointment
- Links physician, patient, and clinic
- Contains timing, status, and billing information

#### AvailabilityBlock
- Defines when physicians are available
- Supports recurring schedules (daily, weekly, monthly)
- Can be marked as available, unavailable, break, or busy

#### BillingRule
- Defines gap management and billing policies
- Types: minimum_gap, buffer_time, lunch_break, billing_block
- Applied per physician with priority levels

## API Documentation

### POST /api/appointments/recommend

**Description**: Suggests top 10 available appointment slots for a patient and physician.

#### Request Body
```json
{
  "clinicId": "c001",
  "physicianId": "p001", 
  "patientId": "u123",
  "preferredDate": "2025-07-01",
  "durationMinutes": 15,
  "reasonForVisit": "Regular checkup"
}
```

#### Response Body
```json
{
  "status": "success",
  "recommendedSlots": [
    {
      "startTime": "2025-07-01T09:00:00.000Z",
      "endTime": "2025-07-01T09:15:00.000Z",
      "durationMinutes": 15,
      "confidence": 95,
      "conflicts": []
    },
    {
      "startTime": "2025-07-01T10:30:00.000Z",
      "endTime": "2025-07-01T10:45:00.000Z",
      "durationMinutes": 15,
      "confidence": 87,
      "conflicts": ["Close proximity to existing appointment may cause scheduling conflicts"]
    }
  ],
  "totalSlotsFound": 8,
  "searchCriteria": {
    "clinicId": "c001",
    "physicianId": "p001",
    "patientId": "u123",
    "preferredDate": "2025-07-01",
    "durationMinutes": 15
  }
}
```

#### Confidence Score
- **90-100**: Optimal slot with no conflicts
- **70-89**: Good slot with minor issues
- **50-69**: Acceptable slot with some conflicts
- **Below 50**: Slot with significant conflicts

## Scheduling Algorithm

### Algorithm Overview
The scheduling algorithm follows these key steps:

1. **Validation Phase**
   - Verify physician and clinic exist and are active
   - Ensure physician belongs to the specified clinic

2. **Data Collection Phase**
   - Retrieve existing appointments for the date
   - Get physician availability blocks
   - Fetch applicable billing rules

3. **Slot Generation Phase**
   - Generate all possible time slots within working hours
   - Use clinic hours if no availability blocks defined
   - Create 15-minute interval slots by default

4. **Conflict Resolution Phase**
   - Filter out slots that overlap with existing appointments
   - Apply billing rules and calculate penalties

5. **Scoring and Ranking Phase**
   - Score each slot based on multiple criteria
   - Sort by confidence score and return top 10

### Detailed Algorithm Flow

```
┌─────────────────┐
│   Start Request │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Validate Input  │
│ - Physician     │
│ - Clinic        │
│ - Patient       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Get Data        │
│ - Appointments  │
│ - Availability  │
│ - Billing Rules │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Generate Slots  │
│ - Clinic Hours  │
│ - 15min Intervals│
│ - Duration Check │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Filter Conflicts│
│ - Appointment   │
│   Overlaps      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Apply Rules &   │
│ Calculate Score │
│ - Billing Rules │
│ - Proximity     │
│ - Preferences   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Sort & Return   │
│ Top 10 Slots    │
└─────────────────┘
```

### Scoring System

#### Base Confidence Score: 100

#### Penalties Applied:
- **Lunch Break Conflict**: -50 points
- **Minimum Gap Violation**: -30 points
- **Buffer Time Not Met**: -15 points
- **Billing Block Conflict**: -100 points (effectively blocks slot)
- **Close Proximity**: -10 points

#### Bonuses Applied:
- **Morning Slots (before 12 PM)**: +5 points

### Gap Management and Billing Rules

#### Rule Types

1. **MINIMUM_GAP**
   - Enforces mandatory gaps between appointments
   - Example: 15 minutes between appointments for room cleaning

2. **BUFFER_TIME**
   - Preferred (but not mandatory) gaps
   - Lower penalty than minimum gaps

3. **LUNCH_BREAK**
   - Blocks appointments during specified times
   - Example: 12:00 PM - 1:00 PM lunch break

4. **BILLING_BLOCK**
   - Completely blocks time periods
   - Used for administrative tasks or meetings

### Slot Optimization Strategy

#### Avoid Clustering
- Penalize slots too close to existing appointments
- Prevents overpacked schedules
- Allows for appointment overruns

#### Prioritize Least Disruptive Slots
- Morning slots preferred for better patient energy
- Adequate gaps for physician preparation
- Consider travel time between different types of appointments

#### Multi-Clinic Support
- Each clinic has independent operating hours
- Physicians can work across multiple clinics
- Billing rules applied per physician regardless of clinic

## Error Handling

### Common Error Scenarios
1. **Physician Not Found**: Returns 404 with descriptive message
2. **Clinic Inactive**: Returns 400 with clinic status message
3. **No Available Slots**: Returns success with empty slots array
4. **Invalid Date Range**: Returns 400 with validation errors

### Validation Rules
- Appointment duration: 15-240 minutes
- Date format: ISO 8601 date string
- All IDs must be valid UUIDs

## Future Scalability Considerations

### Performance Optimizations
1. **Database Indexing**
   - Index on (physicianId, startTime) for appointments
   - Index on (clinicId, isActive) for physicians

2. **Caching Strategy**
   - Cache physician availability patterns
   - Cache frequently accessed billing rules

3. **Horizontal Scaling**
   - Partition data by clinic or region
   - Use read replicas for slot recommendations

### Feature Extensions
1. **Multi-day Recommendations**
   - Extend algorithm to suggest slots across multiple days
   - Consider patient and physician preferences

2. **Resource Management**
   - Include room/equipment availability
   - Handle shared resources across physicians

3. **Advanced Scheduling**
   - Priority-based scheduling for urgent cases
   - Automated rescheduling for cancellations

4. **Integration Points**
   - External calendar systems
   - Payment and billing systems
   - Patient notification systems

## Assumptions Made

1. **Single Timezone**: All times stored in UTC, converted at client level
2. **15-minute Intervals**: Default slot generation uses 15-minute intervals
3. **Same-day Scheduling**: Current implementation focuses on single-day recommendations
4. **Binary Availability**: Physicians are either available or not (no partial availability)
5. **PostgreSQL Database**: Schema designed specifically for PostgreSQL features (JSON columns, UUID types)

## Conclusion

This healthcare scheduling system provides a robust foundation for appointment management with intelligent slot recommendations. The algorithm considers multiple factors including physician availability, existing commitments, and billing requirements to suggest optimal appointment times while maintaining scheduling flexibility and avoiding conflicts. 