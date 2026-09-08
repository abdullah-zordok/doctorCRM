# SQLite Migration and Fake Data Generation Specification

**Date**: 2026-09-08  
**Status**: Approved  
**Topic**: Database Refactoring to SQLite with Turso/LibSQL Vercel compatibility and Seed Fake Data

---

## 1. Problem Statement & Motivation
The Doctor Clinic Management System currently runs on PostgreSQL via Docker Compose. The goal is to:
1. Transition the primary database to **SQLite** (`file:./dev.db`) for lightweight local development and zero external database container dependencies.
2. Ensure full compatibility with **Vercel** serverless hosting by adding optional **Turso / LibSQL** support via `@prisma/adapter-libsql` and `@libsql/client`.
3. Provide rich, realistic clinical fake data (Doctor, Secretary, Patients, Appointments, Visits, Prescriptions, and Payments) to make testing and demonstration immediate and complete.

---

## 2. Technical Architecture

### 2.1 Database & Prisma Setup
- **ORM**: Prisma 6.x (`prisma`, `@prisma/client`).
- **Driver Adapters**: `@prisma/adapter-libsql`, `@libsql/client`.
- **Local Database**: SQLite file at `backend/prisma/dev.db`.
- **Production (Vercel)**: When `TURSO_DATABASE_URL` (and optional `TURSO_AUTH_TOKEN`) is provided in environment variables, the Prisma client instantiates with `PrismaLibSql` adapter. Otherwise, it falls back to standard SQLite file.

### 2.2 Schema Changes (`backend/prisma/schema.prisma`)
- `datasource db`: Provider changed from `"postgresql"` to `"sqlite"`.
- `generator client`: Enabled preview feature `["driverAdapters"]`.
- `Decimal` fields in `Payment` and `PaymentRevision`:
  - Removed PostgreSQL-specific `@db.Decimal(12, 2)` attribute while retaining the `Decimal` type supported in Prisma 6 for SQLite.
- `Enum` types:
  - `Role`, `AppointmentStatus`, `VisitStatus`, `PrescriptionStatus`, `PaymentMethod` remain intact, supported natively at the Prisma client level in Prisma 6 for SQLite.
- `Json` fields:
  - `medications` in `Prescription` and `PrescriptionRevision` remains `Json`, supported natively in Prisma 6 for SQLite.

### 2.3 Environment & Configuration (`backend/src/config/env.ts`)
- Adjust `DATABASE_URL` validation in Zod:
  - Relax from `z.string().url()` to `z.string().min(1).default("file:./dev.db")` to support standard SQLite `file:` URIs and Turso URLs.

### 2.4 Prisma Client Initialization (`backend/src/lib/prisma.ts`)
- Inspect environment:
  - If `TURSO_DATABASE_URL` or `DATABASE_URL` starts with `libsql://` or `https://` (or `TURSO_DATABASE_URL` is present), configure `createClient` from `@libsql/client` and `PrismaLibSql` adapter.
  - Otherwise, initialize standard `new PrismaClient()`.

---

## 3. Seed & Fake Data Generation

The seed script (`backend/prisma/seed.ts`) will generate a complete, realistic dataset:
1. **Users**:
   - Primary Doctor: `doctor@example.com` / `ChangeMe123!` (Role: `DOCTOR`).
   - Secretary: `secretary@example.com` / `ChangeMe123!` (Role: `SECRETARY`).
2. **Clinic**:
   - Default clinic: "Al-Amal Medical Clinic" (عيادة الأمل التخصصية) with phone and address.
3. **Patients (10+ realistic profiles)**:
   - Arabic and English names, Egyptian phone numbers, realistic medical notes (allergies, chronic conditions).
4. **Appointments (15+ across statuses)**:
   - Past, today, and future appointments spanning `SCHEDULED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`.
5. **Visits & Diagnoses (8+ visits)**:
   - Real clinical scenarios (Hypertension follow-up, Type 2 Diabetes routine check, Acute Bronchitis, Gastroenteritis, etc.).
   - Includes realistic `VisitRevision` records showing audit log history.
6. **Prescriptions (6+ active prescriptions)**:
   - Valid JSON medications with dosage, frequency, duration (e.g. Amoxicillin 500mg, Metformin 850mg, Panadol Extra, Omeprazole 20mg).
7. **Payments (10+ financial records)**:
   - Fully paid, partially paid, and outstanding balances.
   - Varied payment methods (`CASH`, `CARD`, `BANK_TRANSFER`).
   - Includes `PaymentRevision` records verifying financial audit trails.

---

## 4. Docker & Local Tooling
- `docker-compose.yml`:
  - Remove postgres container dependency for `backend` and `frontend`.
  - Mount `./backend/prisma` or SQLite file volume so local data persists during Docker runs.
- NPM scripts in `backend/package.json`:
  - `pnpm prisma generate`
  - `pnpm prisma db push` / `pnpm prisma migrate dev`
  - `pnpm prisma db seed` (executes `tsx prisma/seed.ts`).

---

## 5. Verification & Testing Strategy
1. **Typecheck & Lint**: `pnpm --filter @doctor-clinic/backend typecheck` and `pnpm --filter @doctor-clinic/backend lint`.
2. **Unit & Integration Tests**: Run existing test suite in `backend` to ensure services and controllers work seamlessly with SQLite.
3. **Seed Verification**: Run `pnpm seed` and query DB to verify total count of users, patients, appointments, visits, prescriptions, and payments.
4. **API Readiness Check**: Verify `/api/health` and `/api/auth/login` authenticate successfully against the seeded SQLite database.
