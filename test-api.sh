#!/bin/bash

# Healthcare Appointment Scheduling System - API Test Script
echo "🏥 Healthcare Appointment Scheduling System - API Test"
echo "=================================================="

# Base URL
BASE_URL="http://localhost:3000"

echo ""
echo "📋 Testing appointment recommendation endpoint..."
echo ""

# Test 1: Dr. Watson with 15-minute appointment
echo "Test 1: Dr. Watson - 15 minute appointment"
echo "Request: POST $BASE_URL/api/appointments/recommend"

curl -X POST "$BASE_URL/api/appointments/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "clinicId": "550e8400-e29b-41d4-a716-446655440000",
    "physicianId": "750e8400-e29b-41d4-a716-446655440000", 
    "patientId": "650e8400-e29b-41d4-a716-446655440000",
    "preferredDate": "2025-07-01",
    "durationMinutes": 15,
    "reasonForVisit": "Regular checkup"
  }' | jq '.'

echo ""
echo "=================================="
echo ""

# Test 2: Dr. Miller with 30-minute appointment
echo "Test 2: Dr. Miller - 30 minute appointment"

curl -X POST "$BASE_URL/api/appointments/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "clinicId": "550e8400-e29b-41d4-a716-446655440000",
    "physicianId": "750e8400-e29b-41d4-a716-446655440001",
    "patientId": "650e8400-e29b-41d4-a716-446655440001", 
    "preferredDate": "2025-07-01",
    "durationMinutes": 30,
    "reasonForVisit": "Cardiac consultation"
  }' | jq '.'

echo ""
echo "=================================="
echo ""

# Test 3: Dr. Davis (no existing appointments) with 45-minute appointment
echo "Test 3: Dr. Davis - 45 minute appointment (should have full availability)"

curl -X POST "$BASE_URL/api/appointments/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "clinicId": "550e8400-e29b-41d4-a716-446655440001",
    "physicianId": "750e8400-e29b-41d4-a716-446655440002",
    "patientId": "650e8400-e29b-41d4-a716-446655440002",
    "preferredDate": "2025-07-01", 
    "durationMinutes": 45,
    "reasonForVisit": "Pediatric consultation"
  }' | jq '.'

echo ""
echo "=================================="
echo ""

# Test 4: Invalid physician ID (error case)
echo "Test 4: Invalid physician ID (should return error)"

curl -X POST "$BASE_URL/api/appointments/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "clinicId": "550e8400-e29b-41d4-a716-446655440000",
    "physicianId": "invalid-id",
    "patientId": "650e8400-e29b-41d4-a716-446655440000",
    "preferredDate": "2025-07-01",
    "durationMinutes": 15
  }' | jq '.'

echo ""
echo "🏁 API Testing Complete!"
echo ""
echo "💡 Tips:"
echo "- Install jq for better JSON formatting: brew install jq (Mac) or apt install jq (Ubuntu)"
echo "- Make sure the application is running: npm run start:dev"
echo "- Load sample data: psql -d healthcare_db -f src/sample-data.sql" 