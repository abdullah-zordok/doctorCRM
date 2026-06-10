# Doctor Clinic Management System - Backend Blueprint

## Project Overview

A backend system for a **single doctor** managing multiple clinics and secretaries.

The backend serves two dashboards:

- Doctor Dashboard
- Secretary Dashboard

The first implementation focuses **only on the backend API**.

---

# Technology Stack

- Node.js
- Express.js + TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Docker & Docker Compose
- REST API
- PDF Prescription Generation

---

# Roles

## Doctor
- Manage clinics
- Manage secretaries
- View reports
- Manage patients
- Create visits
- Create prescriptions
- View financial reports

## Secretary
- Login
- Register patients
- Edit patient information
- Manage appointments
- Register payments
- Upload patient files

---

# Main Modules

1. Authentication
2. Users
3. Clinics
4. Patients
5. Visits
6. Prescriptions
7. Appointments
8. Payments
9. Dashboard

---

# Docker Architecture

```
doctor-system/
│
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── src/
│   ├── prisma/
│   └── package.json
│
├── frontend/
│   ├── Dockerfile
│   └── package.json
│
└── postgres(volume)
```

Run everything with:

```bash
docker compose up --build
```

---

# SPEC 01 - Foundation

## Goal

Build project infrastructure.

### Tasks

- Docker setup
- PostgreSQL
- Prisma
- JWT Auth
- Role middleware
- Environment config
- Logging
- Validation
- Error handling

### Deliverables

- Login API
- Doctor authentication
- Secretary authentication
- Dockerized backend

---

# SPEC 02 - Clinic Management

## Goal

Business modules.

### Clinics

CRUD

### Secretaries

CRUD

### Patients

CRUD

### Appointments

CRUD

### Payments

Create
Update
Reports

### Deliverables

Complete clinic management APIs.

---

# SPEC 03 - Medical System

## Goal

Medical records.

### Visits

- Symptoms
- Diagnosis
- Treatment
- Notes

### Prescriptions

- Medicines
- Instructions
- PDF Export

### Dashboard

Doctor dashboard statistics.

Secretary dashboard summary.

### Reports

Daily income

Monthly income

Clinic statistics

Patient statistics

---

# API Modules

/auth
/users
/clinics
/patients
/appointments
/payments
/visits
/prescriptions
/dashboard

---

# Development Order

1. Docker
2. PostgreSQL
3. Prisma
4. Auth
5. Users
6. Clinics
7. Patients
8. Appointments
9. Visits
10. Prescriptions
11. Payments
12. Dashboard

---

# Future Features

- WhatsApp reminders
- SMS reminders
- Analytics
- Excel export
- Audit log
- File storage
- Multi-language
- SaaS support
