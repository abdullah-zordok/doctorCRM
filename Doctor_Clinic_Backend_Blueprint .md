# Doctor Clinic Management System — Backend-First Project Blueprint

> **Goal:** Build a simple, well-structured, and scalable backend for a **Single-Doctor Clinic Management System** that serves both a **Doctor Dashboard** and a **Secretary Dashboard**.
>
> The project will follow a **Spec-Driven Development (SDD)** approach using **GitHub Spec Kit**, with the implementation divided into **three independent specifications**.

---

# 1. Project Overview

This project is a **Clinic Management System** designed for a **single doctor**.

The doctor can manage:

* Multiple clinics
* Multiple secretaries
* Patients
* Medical visits
* Prescriptions
* Appointments
* Payments
* Financial reports

The secretary will use a simplified administrative dashboard to manage patients, appointments, and payments according to her permissions.

The project follows a **Backend-First Architecture**, where the backend will be fully completed before building the frontend.

---

# 2. MVP Scope

## Included

* JWT Authentication
* Doctor and Secretary roles
* Role-Based Access Control (RBAC)
* Secretary Management
* Clinic Management
* Patient Management
* Patient Editing by Secretary
* Medical Visit Management
* Prescription Management
* PDF Prescription Generation
* Appointment Management
* Payment Management
* Doctor Dashboard APIs
* Secretary Dashboard APIs
* Dockerized Development Environment
* PostgreSQL Database

---

## Excluded

* WhatsApp Integration
* SMS Notifications
* Patient Online Portal
* Multi-Doctor Support
* Multi-Tenant SaaS
* Insurance Management
* Pharmacy Integration
* OCR Integration

---

# 3. User Roles

## Doctor

The Doctor is the owner of the system and has full access.

### Permissions

* Login
* Manage Secretaries
* Manage Clinics
* View all Patients
* Create Medical Visits
* Update Medical Visits
* Write Diagnoses
* Write Treatments
* Create Prescriptions
* Generate Prescription PDF
* View all Appointments
* View all Payments
* View Operational Reports
* View Financial Reports

---

## Secretary

The Secretary has administrative permissions only.

### Permissions

* Login
* Register Patients
* Edit Patient Information
* Search Patients
* Create Appointments
* Update Appointments
* Cancel Appointments
* Register Payments
* View Administrative Patient Data

### Restrictions

* Cannot delete Patients permanently
* Cannot create Medical Diagnoses
* Cannot edit Doctor Diagnoses
* Cannot delete Medical Visits
* Cannot access detailed financial reports
* Cannot create Doctor accounts
* Cannot change Doctor permissions

---

# 4. Technology Stack

## Backend

* Node.js
* TypeScript
* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication
* bcrypt
* Zod Validation
* PDFKit (or Puppeteer)
* Multer (future file uploads)

---

## Frontend (Future)

* React
* Vite
* TypeScript
* Tailwind CSS
* shadcn/ui

---

## Infrastructure

* Docker
* Docker Compose
* PostgreSQL Container
* Backend Container
* Frontend Container (future)

---

# 5. Project Startup

The entire project should start using:

```bash
docker compose up --build
```

Expected services:

```text
postgres
backend
frontend (future)
```

---

# 6. Project Structure

```text
doctor-clinic-system/

docker-compose.yml

backend/
│
├── Dockerfile
├── package.json
├── tsconfig.json
├── .env.example
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
└── src/
    ├── config/
    ├── middleware/
    ├── modules/
    ├── utils/
    └── types/

frontend/

specs/
    001-core-backend-foundation.md
    002-clinic-patient-workflow.md
    003-medical-finance-dashboard.md
```

---

# 7. Docker Architecture

The project should run entirely inside Docker.

Services:

* PostgreSQL
* Backend API
* Frontend (future)

All services should be orchestrated using Docker Compose.

---

# 8. Database Models

The system includes the following entities:

* User
* Clinic
* Patient
* Appointment
* Visit
* Prescription
* Payment

Supporting enums:

* Role
* AppointmentStatus
* PaymentMethod

---

# 9. REST API Design

## Authentication

```
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

---

## Secretaries

```
GET    /api/users/secretaries
POST   /api/users/secretaries
GET    /api/users/secretaries/:id
PATCH  /api/users/secretaries/:id
PATCH  /api/users/secretaries/:id/status
```

---

## Clinics

```
GET    /api/clinics
POST   /api/clinics
GET    /api/clinics/:id
PATCH  /api/clinics/:id
PATCH  /api/clinics/:id/status
```

---

## Patients

```
GET    /api/patients
POST   /api/patients
GET    /api/patients/:id
PATCH  /api/patients/:id
PATCH  /api/patients/:id/status
```

---

## Appointments

```
GET    /api/appointments
POST   /api/appointments
GET    /api/appointments/:id
PATCH  /api/appointments/:id
PATCH  /api/appointments/:id/status
```

---

## Visits

```
GET    /api/patients/:patientId/visits
POST   /api/patients/:patientId/visits
GET    /api/visits/:id
PATCH  /api/visits/:id
```

---

## Prescriptions

```
POST  /api/visits/:visitId/prescriptions
GET   /api/prescriptions/:id
PATCH /api/prescriptions/:id
GET   /api/prescriptions/:id/pdf
```

---

## Payments

```
GET  /api/payments
POST /api/payments
GET  /api/payments/:id
GET  /api/payments/reports/summary
```

---

## Dashboard

```
GET /api/dashboard/doctor/summary
GET /api/dashboard/doctor/revenue
GET /api/dashboard/doctor/today-appointments

GET /api/dashboard/secretary/summary
GET /api/dashboard/secretary/today-appointments
```

---

# 10. Project Specifications

## Spec 001 — Core Backend Foundation

### Goal

Build the backend foundation including:

* Docker
* PostgreSQL
* Express
* TypeScript
* Prisma
* Authentication
* Authorization
* Project Architecture

### Includes

* Backend setup
* Docker setup
* Prisma
* JWT Authentication
* Password Hashing
* Role Middleware
* Validation Middleware
* Global Error Handler
* Doctor Seed Account

### Excludes

* Patients
* Clinics
* Visits
* Prescriptions
* Payments
* Dashboards

---

## Acceptance Criteria

* Docker Compose starts successfully
* PostgreSQL works
* Prisma migrations run successfully
* Doctor seed account works
* Authentication middleware works
* Role middleware works

---

# Spec 002 — Administrative Workflow

## Goal

Implement the administrative modules.

### Includes

* Secretary Management
* Clinic Management
* Patient Management
* Appointment Management
* Search
* Pagination
* Filtering

### Business Rules

* Patient requires name, phone, and clinic
* Appointment requires existing patient
* Appointment requires existing clinic
* Soft Delete only
* Secretary cannot create Doctor accounts

---

## Acceptance Criteria

* Doctor creates Secretary
* Doctor creates Clinic
* Secretary creates Patient
* Secretary edits Patient
* Patient search works
* Appointment management works

---

# Spec 003 — Medical & Financial Workflow

## Goal

Implement medical and financial modules.

### Includes

* Medical Visits
* Diagnoses
* Treatments
* Prescriptions
* Prescription PDF
* Payments
* Doctor Dashboard
* Secretary Dashboard

---

## Business Rules

* Visit belongs to Patient + Clinic + Doctor
* Prescription belongs to one Visit
* Payment Remaining = Total - Paid
* Paid cannot exceed Total
* No negative financial values

---

## Doctor Dashboard

Should display:

* Total Patients
* Today's Appointments
* Total Visits
* Today's Revenue
* Monthly Revenue
* Revenue per Clinic

---

## Secretary Dashboard

Should display:

* Today's Appointments
* Today's Registered Patients
* Today's Payments
* Outstanding Balances

---

# 11. Development Roadmap

## Phase 1

Backend Foundation

```
Docker
PostgreSQL
Express
Prisma
Authentication
Authorization
```

---

## Phase 2

Administrative Workflow

```
Clinics
Secretaries
Patients
Appointments
```

---

## Phase 3

Medical Workflow

```
Visits
Prescriptions
PDF
Payments
Dashboards
```

---

## Phase 4

Frontend

```
Doctor Dashboard
Secretary Dashboard
```

---

# 12. Environment Variables

```env
PORT=4000
NODE_ENV=development

DATABASE_URL=postgresql://doctor_user:doctor_password@postgres:5432/doctor_db

JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=7d
```

---

# 13. Standard API Response

## Success

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

---

## Error

```json
{
  "success": false,
  "message": "Validation error",
  "errors": []
}
```

---

# 14. Development Rules

* Never place business logic inside routes.
* Every module must contain:

  * routes
  * controller
  * service
  * validation
* All protected routes require authentication.
* Doctor-only endpoints require role middleware.
* Validate all requests using Zod.
* Use Soft Delete instead of Hard Delete.
* Store passwords hashed.
* Never expose passwords.
* Use Decimal for financial values.
* PDF generation should be isolated.
* Dashboard logic belongs inside services.

---

# 15. Recommended Spec Kit Workflow

```text
/speckit.specify
/speckit.clarify
/speckit.plan
/speckit.tasks
/speckit.implement
```

For production-ready development:

```text
/speckit.checklist
/speckit.analyze
```

---

# 16. Initial Spec Kit Prompt

```text
Build the backend foundation for a single-doctor clinic management system.

Use Node.js, TypeScript, Express.js, Prisma, PostgreSQL, JWT authentication, bcrypt password hashing, Zod validation, and Docker Compose.

The system has two roles: DOCTOR and SECRETARY.

Implement authentication, role-based authorization, database setup, user model, seed doctor account, global error handling, and project structure.

Do not implement patients, clinics, appointments, payments, visits, or prescriptions in this specification.
```

---

# 17. Conclusion

The project follows a **Backend-First Architecture**.

A single backend will serve:

```
Doctor Dashboard
Secretary Dashboard
```

The dashboards share the same backend while Role-Based Authorization determines available operations and accessible data.

The project should be implemented in three phases:

```
Spec 001 → Core Backend Foundation

Spec 002 → Administrative Workflow

Spec 003 → Medical & Financial Workflow
```

This structure keeps the project modular, maintainable, scalable, and fully compatible with **GitHub Spec Kit** and **Spec-Driven Development**.
