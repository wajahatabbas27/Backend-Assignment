-- Sample data for Healthcare Appointment Scheduling System
-- Run this after the application has created the database tables

-- Insert sample clinic
INSERT INTO clinics (id, name, address, phone, "openTime", "closeTime", "operatingDays", "isActive") VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Downtown Medical Center', '123 Main St, City, State 12345', '+1-555-0100', '08:00', '17:00', '[1,2,3,4,5]', true),
('550e8400-e29b-41d4-a716-446655440001', 'Suburban Health Clinic', '456 Oak Ave, Suburb, State 12346', '+1-555-0200', '09:00', '18:00', '[1,2,3,4,5,6]', true);

-- Insert sample patients
INSERT INTO patients (id, "firstName", "lastName", email, phone, "dateOfBirth", gender, address, "insuranceProvider", "insurancePolicyNumber", "isActive") VALUES 
('650e8400-e29b-41d4-a716-446655440000', 'John', 'Smith', 'john.smith@email.com', '+1-555-1001', '1985-03-15', 'male', '789 Pine St, City, State', 'HealthCorp', 'HC123456789', true),
('650e8400-e29b-41d4-a716-446655440001', 'Sarah', 'Johnson', 'sarah.j@email.com', '+1-555-1002', '1990-07-22', 'female', '321 Elm St, City, State', 'MediCare Plus', 'MP987654321', true),
('650e8400-e29b-41d4-a716-446655440002', 'Michael', 'Brown', 'mike.brown@email.com', '+1-555-1003', '1978-11-08', 'male', '654 Maple Dr, Suburb, State', 'Universal Health', 'UH456789123', true);

-- Insert sample physicians
INSERT INTO physicians (id, "firstName", "lastName", email, phone, specialization, "licenseNumber", "defaultAppointmentDuration", "clinicId", "isActive") VALUES 
('750e8400-e29b-41d4-a716-446655440000', 'Dr. Emily', 'Watson', 'e.watson@clinic.com', '+1-555-2001', 'General Medicine', 'MD12345', 30, '550e8400-e29b-41d4-a716-446655440000', true),
('750e8400-e29b-41d4-a716-446655440001', 'Dr. James', 'Miller', 'j.miller@clinic.com', '+1-555-2002', 'Cardiology', 'MD12346', 45, '550e8400-e29b-41d4-a716-446655440000', true),
('750e8400-e29b-41d4-a716-446655440002', 'Dr. Lisa', 'Davis', 'l.davis@suburban.com', '+1-555-2003', 'Pediatrics', 'MD12347', 30, '550e8400-e29b-41d4-a716-446655440001', true);

-- Insert sample availability blocks (working hours)
INSERT INTO availability_blocks (id, "startTime", "endTime", status, "recurrenceType", "physicianId", "isActive") VALUES 
-- Dr. Watson - Monday to Friday 9 AM to 5 PM for July 1, 2025
('850e8400-e29b-41d4-a716-446655440000', '2025-07-01 09:00:00', '2025-07-01 12:00:00', 'available', 'none', '750e8400-e29b-41d4-a716-446655440000', true),
('850e8400-e29b-41d4-a716-446655440001', '2025-07-01 13:00:00', '2025-07-01 17:00:00', 'available', 'none', '750e8400-e29b-41d4-a716-446655440000', true),

-- Dr. Miller - Morning shift July 1, 2025
('850e8400-e29b-41d4-a716-446655440002', '2025-07-01 08:00:00', '2025-07-01 12:00:00', 'available', 'none', '750e8400-e29b-41d4-a716-446655440001', true),

-- Dr. Davis - Full day July 1, 2025
('850e8400-e29b-41d4-a716-446655440003', '2025-07-01 09:00:00', '2025-07-01 17:00:00', 'available', 'none', '750e8400-e29b-41d4-a716-446655440002', true);

-- Insert sample billing rules
INSERT INTO billing_rules (id, "ruleType", name, description, "durationMinutes", "applicableStartTime", "applicableEndTime", "applicableDays", priority, "physicianId", "isActive") VALUES 
-- Lunch break for Dr. Watson
('950e8400-e29b-41d4-a716-446655440000', 'lunch_break', 'Lunch Break', 'Daily lunch break', 60, '12:00', '13:00', '[1,2,3,4,5]', 1, '750e8400-e29b-41d4-a716-446655440000', true),

-- Minimum gap between appointments
('950e8400-e29b-41d4-a716-446655440001', 'minimum_gap', 'Room Cleaning', 'Time needed for room sanitization', 10, null, null, '[1,2,3,4,5,6]', 2, '750e8400-e29b-41d4-a716-446655440000', true),
('950e8400-e29b-41d4-a716-446655440002', 'minimum_gap', 'Equipment Setup', 'Time for cardiology equipment setup', 15, null, null, '[1,2,3,4,5]', 2, '750e8400-e29b-41d4-a716-446655440001', true),

-- Buffer time preferences
('950e8400-e29b-41d4-a716-446655440003', 'buffer_time', 'Preferred Buffer', 'Preferred time between appointments', 15, null, null, '[1,2,3,4,5,6,0]', 3, '750e8400-e29b-41d4-a716-446655440002', true);

-- Insert some existing appointments for July 1, 2025 to test scheduling around them
INSERT INTO appointments (id, "startTime", "endTime", "durationMinutes", status, type, "reasonForVisit", "physicianId", "patientId", "clinicId") VALUES 
-- Dr. Watson has appointments at 10:00 and 15:00
('150e8400-e29b-41d4-a716-446655440000', '2025-07-01 10:00:00', '2025-07-01 10:30:00', 30, 'scheduled', 'consultation', 'Annual checkup', '750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
('150e8400-e29b-41d4-a716-446655440001', '2025-07-01 15:00:00', '2025-07-01 15:30:00', 30, 'confirmed', 'follow_up', 'Follow up visit', '750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000'),

-- Dr. Miller has one appointment at 09:30
('150e8400-e29b-41d4-a716-446655440002', '2025-07-01 09:30:00', '2025-07-01 10:15:00', 45, 'scheduled', 'consultation', 'Cardiac consultation', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000');

-- Note: Dr. Davis (p003) has no existing appointments for July 1, 2025, so should have full availability 