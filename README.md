<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Healthcare Appointment Scheduling System

A robust backend system built with NestJS and PostgreSQL for managing healthcare appointments with intelligent slot recommendations.

## 🚀 Features

- **Multi-clinic Support**: Handle appointments across multiple healthcare facilities
- **Intelligent Scheduling**: AI-powered slot recommendations considering physician availability, gaps, and billing rules
- **Flexible Billing Rules**: Support for minimum gaps, buffer times, lunch breaks, and billing blocks
- **Real-time Conflict Resolution**: Avoid double bookings and scheduling conflicts
- **Comprehensive API**: RESTful endpoints for appointment management
- **Scalable Architecture**: Built with enterprise-grade patterns and best practices

## 🏗️ Architecture

### Technology Stack
- **Backend**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Validation**: class-validator, class-transformer
- **Architecture Pattern**: Modular monolith with clear separation of concerns

### Core Components
- **Entities**: Database models with relationships
- **Appointments Module**: Core scheduling logic and API
- **Scheduling Service**: Advanced algorithm for slot recommendations
- **Billing Rules Engine**: Configurable gap management system

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd backend-assignment
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# For Supabase (Postgres)
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
NODE_ENV=development
PORT=3000
```
- You can find your Supabase Postgres connection string in the Supabase dashboard under **Project Settings > Database > Connection string**.
- Example:
```env
DATABASE_URL=postgresql://postgres:yourpassword@db.xxxxx.supabase.co:5432/postgres
```

---

### 4. Database Setup
```bash
# Create PostgreSQL database (if using local Postgres)
createdb healthcare_db

# Start the application (this will auto-create tables due to synchronize: true)
npm run start:dev
```

### 5. Load Sample Data (Supabase/Postgres)

If you are using **Supabase** or any remote PostgreSQL instance:

1. Open the `src/sample-data.sql` file in a text editor.
2. Copy all the SQL code.
3. Go to your Supabase project dashboard.
4. In the left sidebar, click on **SQL Editor**.
5. Paste the SQL code into the editor and click **Run**.
6. Go to the **Table Editor** to verify that data has been inserted (you should see rows in `clinics`, `physicians`, `patients`, etc.).

If you are using local Postgres, you can also run:
```bash
psql -d healthcare_db -f src/sample-data.sql
```

---

### 6. Environment Configuration for Supabase

Create a `.env` file in the root directory with your Supabase connection string:
```env
# For Supabase (Postgres)
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
NODE_ENV=development
PORT=3000
```
- You can find your Supabase Postgres connection string in the Supabase dashboard under **Project Settings > Database > Connection string**.
- Example:
```env
DATABASE_URL=postgresql://postgres:yourpassword@db.xxxxx.supabase.co:5432/postgres
```

---

### 7. Start the Application
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

---

### 8. Troubleshooting: Verifying Data in Supabase
- If your API returns errors like "Physician not found or inactive", check your Supabase tables in the Table Editor to ensure data is present.
- If tables are empty, repeat the sample data loading steps above.
- Make sure your `.env` file points to the correct Supabase database.

## 🔧 API Documentation

### POST /api/appointments/recommend

Suggests top 10 available appointment slots for a patient and physician.

#### Request Body
```json
{
  "clinicId": "c001-1234-5678-9abc-def012345678",
  "physicianId": "p001-1234-5678-9abc-def012345678",
  "patientId": "u123-1234-5678-9abc-def012345678",
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
      "startTime": "2025-07-01T10:45:00.000Z",
      "endTime": "2025-07-01T11:00:00.000Z",
      "durationMinutes": 15,
      "confidence": 85,
      "conflicts": ["Close proximity to existing appointment"]
    }
  ],
  "totalSlotsFound": 8,
  "searchCriteria": {
    "clinicId": "c001-1234-5678-9abc-def012345678",
    "physicianId": "p001-1234-5678-9abc-def012345678",
    "patientId": "u123-1234-5678-9abc-def012345678",
    "preferredDate": "2025-07-01",
    "durationMinutes": 15
  }
}
```

#### Confidence Scoring
- **90-100**: Optimal slot with no conflicts
- **70-89**: Good slot with minor issues
- **50-69**: Acceptable slot with some conflicts
- **Below 50**: Slot with significant conflicts

## 🧪 Testing the API

### Using cURL
```bash
# Test appointment recommendation
curl -X POST http://localhost:3000/api/appointments/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "clinicId": "c001-1234-5678-9abc-def012345678",
    "physicianId": "p001-1234-5678-9abc-def012345678",
    "patientId": "u123-1234-5678-9abc-def012345678",
    "preferredDate": "2025-07-01",
    "durationMinutes": 30
  }'
```

### Using Postman
1. Import the collection from `docs/postman_collection.json` (if available)
2. Set up environment variables for base URL and sample IDs
3. Execute the appointment recommendation endpoint

## 📊 Database Schema

### Core Entities

#### Clinics
- Multi-location support with operating hours
- Configurable operating days
- Phone and address information

#### Physicians  
- Belongs to one clinic
- Specialization and license tracking
- Configurable default appointment duration

#### Patients
- Comprehensive patient information
- Insurance details and medical history
- Contact information management

#### Appointments
- Links physicians, patients, and clinics
- Status tracking and billing information
- Flexible appointment types

#### Availability Blocks
- Physician working hours
- Recurring schedule support
- Status-based availability (available/busy/break)

#### Billing Rules
- Minimum gaps between appointments
- Lunch breaks and blocked times
- Priority-based rule application

## 🤖 Scheduling Algorithm

The system uses a sophisticated algorithm that:

1. **Validates** physician and clinic availability
2. **Generates** potential time slots within working hours
3. **Filters** conflicts with existing appointments
4. **Applies** billing rules and gap requirements
5. **Scores** slots based on multiple criteria
6. **Ranks** and returns top 10 recommendations

### Scoring Factors
- **Billing rule compliance** (gaps, breaks, blocks)
- **Proximity to existing appointments** (avoid clustering)
- **Time of day preferences** (morning slots bonus)
- **Physician-specific rules** and preferences

## 🔄 Sample Data

The system includes comprehensive sample data:
- 2 clinics with different operating hours
- 3 physicians with various specializations
- 3 patients with insurance information
- Pre-configured availability blocks
- Sample billing rules (lunch breaks, minimum gaps)
- Existing appointments to test conflict resolution

## 📈 Scalability Features

### Performance Optimizations
- Database indexing on frequently queried fields
- Efficient date range queries
- Modular service architecture

### Future Extensibility
- Multi-day scheduling support
- Resource management (rooms, equipment)
- External calendar integration
- Payment system integration
- Automated rescheduling capabilities

## 🛡️ Error Handling

The system provides comprehensive error handling for:
- Invalid physician or clinic IDs
- Inactive entities
- Invalid date formats
- Insufficient appointment duration
- No available slots scenarios

## 🔧 Development

### Project Structure
```
src/
├── entities/              # Database entities
│   ├── clinic.entity.ts
│   ├── physician.entity.ts
│   ├── patient.entity.ts
│   ├── appointment.entity.ts
│   ├── availability-block.entity.ts
│   └── billing-rule.entity.ts
├── appointments/          # Core appointment module
│   ├── dto/              # Data transfer objects
│   ├── appointments.controller.ts
│   ├── appointments.service.ts
│   ├── scheduling.service.ts
│   └── appointments.module.ts
├── app.module.ts         # Main application module
└── main.ts              # Application entry point
```

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Code Quality
```bash
# Linting
npm run lint

# Format code
npm run format
```

## 📖 Documentation

- **[Design Document](DESIGN_DOCUMENT.md)**: Comprehensive system design and architecture
- **[API Reference](docs/api.md)**: Detailed API documentation (if available)
- **[Database Schema](docs/schema.md)**: Entity relationships and schema details (if available)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Refer to the design documentation

## 🎯 Key Assumptions

- Single timezone support (UTC storage)
- 15-minute slot intervals by default
- Same-day scheduling focus
- PostgreSQL-specific features utilized
- Binary availability (available/unavailable)

---

**Built with ❤️ for efficient healthcare scheduling**

## Sample Postman Request & Response

Below are screenshots demonstrating how to test the `/api/appointments/recommend` endpoint using Postman.

### 1. Postman Request Example
This screenshot shows the request body and endpoint setup in Postman:

![Postman request setup for /api/appointments/recommend](screenshots/postman-request.png)

### 2. Postman Response Example
This screenshot shows the successful response with recommended slots:

![Postman response showing recommended slots](screenshots/postman-response.png)
