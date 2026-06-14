# Project Reference: Doctor Clinic Management System

## 1. Project Overview

This repository contains a full-stack Doctor Clinic Management System for a single-doctor clinic with two roles:

- **Doctor**: clinical owner with access to clinical, administrative, prescription, payment, and dashboard workflows.
- **Secretary**: front-desk/admin role focused on patient registration, appointments, patient lookup, and payments within role limits.

The project follows a Spec Kit / spec-driven development workflow. The backend was planned first, followed by frontend foundation and clinic workflow screens.

The current repository includes:

- Dockerized PostgreSQL, backend, and frontend services.
- A TypeScript Express backend using Prisma and PostgreSQL.
- A React/Vite frontend with authentication shell, role-aware navigation, dashboards, patient workflow, visits, prescriptions, and appointments.
- Spec documents for backend foundation, administrative workflow, medical/financial workflow, frontend foundation, and clinic workflow experience.
- UI reference images under `Ui_Kit/` for a later UI kit implementation phase.

## 2. Tech Stack Used

### Backend

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcryptjs password hashing
- Zod request validation
- PDFKit for prescription PDF generation
- Helmet, CORS, Morgan
- Vitest/Supertest-based tests compiled through TypeScript

### Frontend

- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router
- TanStack React Query
- React Hook Form
- Zod
- TanStack Table
- Radix UI primitives
- Lucide React icons
- class-variance-authority, clsx, tailwind-merge

### Infrastructure

- Docker
- Docker Compose
- PostgreSQL 16 Alpine container
- Separate backend and frontend containers

## 3. Folder Structure Explanation

```text
.
|-- backend/
|   |-- prisma/
|   |   |-- schema.prisma
|   |   |-- seed.ts
|   |   `-- migrations/
|   |-- src/
|   |   |-- config/
|   |   |-- lib/
|   |   |-- middleware/
|   |   |-- modules/
|   |   |-- types/
|   |   |-- utils/
|   |   |-- app.ts
|   |   `-- server.ts
|   `-- tests/
|-- frontend/
|   |-- src/
|   |   |-- components/ui/
|   |   |-- features/
|   |   |-- layout/
|   |   |-- lib/
|   |   |-- routes/
|   |   |-- styles/
|   |   |-- types/
|   |   `-- main.tsx
|   `-- index.html
|-- specs/
|   |-- 001-core-backend-foundation/
|   |-- 002-administrative-workflow/
|   |-- 003-medical-financial-workflow/
|   |-- 004-frontend-foundation-shell/
|   `-- 005-clinic-workflow-experience/
|-- Ui_Kit/
|-- docker-compose.yml
|-- README.md
|-- Doctor_Clinic_Backend_Blueprint .md
|-- Doctor_Clinic_Frontend .md
`-- AGENTS.md
```

- `backend/`: Express API, Prisma database schema, migrations, seed script, backend tests, Dockerfile, and backend tooling.
- `frontend/`: Vite React app, shared UI, shell layout, authentication, role routing, and clinic workflow feature modules.
- `specs/`: Spec Kit source of truth for planned and implemented feature phases.
- `Ui_Kit/`: PNG reference screens for the future UI kit implementation spec.
- Root files: Docker Compose setup, project README, blueprint/specification documents, and agent instructions.

## 4. Main Apps / Packages / Modules

### Backend App

Package: `@doctor-clinic/backend`

Entrypoints:

- `backend/src/server.ts`: starts the Express server.
- `backend/src/app.ts`: creates the Express app and mounts API routers.

Backend modules under `backend/src/modules/`:

- `auth`: login, current user, logout.
- `health`: readiness/health endpoint.
- `secretaries`: doctor-managed secretary accounts.
- `clinics`: clinic management.
- `patients`: patient CRUD and status changes.
- `appointments`: appointment CRUD and status changes.
- `visits`: patient visit listing, visit creation, visit reading/updating.
- `prescriptions`: prescription creation, update, retrieval, PDF generation.
- `payments`: payment CRUD and doctor-only summary report.
- `dashboards`: doctor and secretary dashboard summary endpoints.
- `users`: user service support.

### Frontend App

Package: `@doctor-clinic/frontend`

Entrypoint:

- `frontend/src/main.tsx`: mounts React, React Query, notifications, tooltips, auth provider, and router.

Main frontend areas:

- `features/auth`: login, auth context, protected/public route guards.
- `layout`: app shell, sidebar, top nav, breadcrumbs, global search.
- `components/ui`: reusable UI primitives.
- `features/dashboards`: doctor and secretary dashboard pages/widgets.
- `features/patients`: patient list, table, form, profile, profile tabs.
- `features/visits`: visit workspace, visit form, patient context panel.
- `features/prescriptions`: prescription builder, medicine table, print preview.
- `features/appointments`: appointment page, table, booking form.
- `features/shared`: workflow status, mock workflow API, quick actions, sections, timeline, loading/empty/error helpers.
- `routes`: route definitions and workflow path helpers.

## 5. Important Configuration Files

- `docker-compose.yml`: defines `postgres`, `backend`, and `frontend` services.
- `backend/package.json`: backend scripts and dependencies.
- `frontend/package.json`: frontend scripts and dependencies.
- `backend/.env.example`: backend environment variable template.
- `frontend/.env.example`: frontend environment variable template.
- `backend/prisma/schema.prisma`: Prisma data model and enums.
- `backend/prisma/seed.ts`: idempotent seed for initial doctor account.
- `backend/tsconfig.json`, `backend/tsconfig.test.json`: backend TypeScript configuration.
- `frontend/tsconfig.json`, `frontend/tsconfig.node.json`: frontend TypeScript configuration.
- `frontend/vite.config.ts`: Vite config, `@` alias, dev proxy to backend.
- `frontend/tailwind.config.ts`, `frontend/postcss.config.js`: frontend styling setup.
- `backend/eslint.config.js`, `frontend/eslint.config.js`: lint configuration.
- `AGENTS.md`: instructs agents to read `specs/005-clinic-workflow-experience/plan.md`.

## 6. Environment Variables Needed

### Backend

From `backend/.env.example` and `docker-compose.yml`:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://doctor_user:doctor_password@postgres:5432/doctor_db
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=7d
SEED_DOCTOR_EMAIL=doctor@example.com
SEED_DOCTOR_PASSWORD=ChangeMe123!
SEED_DOCTOR_NAME=Clinic Doctor
```

Notes:

- `JWT_SECRET` must be changed for any non-local environment.
- Seed credentials are development defaults and should not be reused in production.
- `DATABASE_URL` points to the Docker Compose PostgreSQL service by default.

### Frontend

From `frontend/.env.example` and `docker-compose.yml`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

If unset, `frontend/src/lib/api-client.ts` falls back to `/api`.

## 7. Database / API / Frontend Structure

### Database

Prisma uses PostgreSQL and defines these enums:

- `Role`: `DOCTOR`, `SECRETARY`
- `AppointmentStatus`: `SCHEDULED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`
- `VisitStatus`: `OPEN`, `COMPLETED`, `CANCELLED`
- `PrescriptionStatus`: `ACTIVE`, `VOIDED`
- `PaymentMethod`: `CASH`, `CARD`, `BANK_TRANSFER`, `OTHER`

Main Prisma models:

- `User`
- `Clinic`
- `Patient`
- `Appointment`
- `Visit`
- `VisitRevision`
- `Prescription`
- `PrescriptionRevision`
- `Payment`
- `PaymentRevision`

The schema includes revision tables for visits, prescriptions, and payments, preserving historical clinical/financial changes.

### Backend API

Mounted in `backend/src/app.ts`:

```text
GET/POST /api/auth/*
GET      /api/health
/api/users/secretaries
/api/clinics
/api/patients
/api/appointments
/api/patients/:patientId/visits
/api/visits
/api/visits/:visitId/prescriptions
/api/prescriptions
/api/payments
/api/dashboard
```

Authentication and role middleware are applied inside the route modules. Most business logic is kept in services, validation in Zod schemas, and HTTP handling in controllers/routes.

### Frontend Routing

Primary routes in `frontend/src/routes/router.tsx`:

- `/login`
- `/doctor`
- `/secretary`
- `/patients`
- `/patients/:patientId`
- `/appointments`
- `/visits/:visitId`
- `/visits/:visitId/prescriptions/new`
- `/payments`
- `/settings`

Role behavior:

- Doctor home: `/doctor`
- Secretary home: `/secretary`
- Doctor-only: visit workspace and prescription builder.
- Shared role routes: patients and appointments.

Important implementation detail:

- Authentication uses the real backend API through `frontend/src/lib/api-client.ts`.
- SPEC 02 workflow pages currently use the in-memory adapter in `frontend/src/features/shared/workflow-api.ts`, not the live backend workflow APIs. This is the main integration gap.

## 8. How The Project Is Expected To Run Locally

From `README.md` and feature quickstarts:

### Full Local Runtime

```bash
docker compose up --build
```

Expected services:

- PostgreSQL on port `5432`
- Backend API on port `4000`
- Frontend app on port `5173`

After services are up, migrations and seed can be run inside the backend service:

```bash
docker compose exec backend pnpm prisma migrate dev
docker compose exec backend pnpm prisma db seed
```

### Backend Local Development

```bash
cd backend
pnpm install
pnpm prisma generate
pnpm typecheck
pnpm test
pnpm build
pnpm lint
```

Backend dev server script:

```bash
pnpm dev
```

### Frontend Local Development

```bash
cd frontend
pnpm install
pnpm dev
pnpm typecheck
pnpm build
pnpm lint
```

Frontend app:

```text
http://localhost:5173
```

Backend API default:

```text
http://localhost:4000/api
```

## 9. Current Implemented Features

### Backend

Implemented modules and behavior found in source/tests:

- Dockerized backend service.
- PostgreSQL and Prisma setup.
- Prisma migrations for backend foundation, administrative workflow, and medical/financial workflow.
- Initial doctor seed account.
- JWT login, current user, logout.
- Auth middleware and role middleware.
- Request validation middleware with Zod.
- Global error and not-found handlers.
- Consistent response helpers.
- Secretaries management.
- Clinics management.
- Patients management.
- Appointments management.
- Visits management.
- Prescription management and PDF generation endpoint.
- Payments management and doctor-only summary route.
- Doctor and secretary dashboard APIs.
- Unit, integration, and contract tests under `backend/tests/`.

### Frontend

Implemented frontend areas found in source/spec tasks:

- Login page and auth provider.
- Token storage and backend-backed auth API calls.
- Public-only and protected route guards.
- Role-aware redirects.
- App shell with sidebar, top nav, breadcrumbs, notifications, and global search.
- Shared UI primitives: buttons, cards, inputs, labels, select, tabs, dialog, dropdown, table, pagination, skeleton, empty/error states, tooltip, badge.
- Doctor dashboard.
- Secretary dashboard.
- Patient list/search/table.
- Patient creation/edit form.
- Patient profile with tabs and timeline.
- Visit workspace with patient context and clinical form.
- Prescription builder with medicine rows and print preview.
- Appointment management with table and form.
- Workflow loading, empty, and error state helpers.
- Route-level lazy loading.

## 10. Missing Parts Or Incomplete Areas

- SPEC 02 final validation tasks remain unchecked:
  - `T060`: run frontend typecheck, lint, tests, and production build.
  - `T061`: browser smoke validation for workflow routes.
- Frontend workflow pages are not fully integrated with live backend workflow APIs. They use `frontend/src/features/shared/workflow-api.ts`, an in-memory mock/store adapter.
- `frontend/package.json` does not define a frontend unit test runner script, although `.test.tsx` files exist and are included in TypeScript compilation.
- `/payments` frontend route is a placeholder page.
- `/settings` frontend route is a placeholder page.
- SPEC 03 UI kit implementation is documented in `Doctor_Clinic_Frontend .md` and image references exist in `Ui_Kit/`, but full pixel-guided UI kit implementation is not shown as complete.
- Backend has live payments APIs, but the frontend payment workflow is not implemented beyond placeholder/profile summary references.
- The current frontend workflow data uses mock patient IDs such as `pat-001` and visit IDs such as `vis-001`; these do not represent persisted backend records unless explicitly seeded elsewhere.

## 11. Possible Bugs, Risks, Or Unclear Areas

### Possible Bugs / Risks

- In `backend/src/modules/payments/payments.routes.ts`, `GET "/:id"` appears before `GET "/reports/summary"`. In Express, `/reports/summary` may be captured as an `id` route before reaching the summary route. This should be verified and likely reordered.
- Backend appointment statuses are `SCHEDULED`, `COMPLETED`, `CANCELLED`, and `NO_SHOW`, while frontend workflow mock statuses include values like `waiting`, `scheduled`, `completed`, and `cancelled`. Integration will need explicit mapping.
- Backend visit statuses are uppercase Prisma enum values, while frontend workflow types use lowercase statuses. Integration will need normalization.
- Backend prescription statuses are `ACTIVE` and `VOIDED`, while frontend workflow mock records use `issued`. Integration will need mapping or model adjustment.
- `JWT_SECRET=change_me_in_production` is acceptable only for local development.
- There is no confirmed CI configuration in the inspected file list.
- No commands were run to validate current typecheck, lint, tests, build, Docker startup, or browser behavior during this documentation pass.

### Unclear / Needs Confirmation

- Whether frontend workflow screens are intentionally mock-first for UX validation or expected to be immediately wired to backend APIs.
- Whether `Ui_Kit/` is intended to replace the current SPEC 02 implementation or only refine visuals later.
- Whether payments should be completed as part of the current frontend milestone or deferred.
- Whether settings should include clinic profile, user preferences, application settings, or all of these.
- Whether multi-clinic support is active in the product UX or only backend-supported for future expansion.

## 12. Suggested Development Plan

1. **Validate current state**
   - Run backend typecheck, lint, tests, and build.
   - Run frontend typecheck, lint, and build.
   - Add/confirm a frontend test runner before claiming `.test.tsx` coverage.

2. **Fix high-confidence backend routing risk**
   - Verify `/api/payments/reports/summary`.
   - If needed, move the summary route before `/:id`.

3. **Replace frontend mock workflow data with backend APIs**
   - Extend `frontend/src/lib/api-client.ts` or create feature API clients for patients, appointments, visits, prescriptions, payments, and dashboards.
   - Map backend enum/status values to frontend display statuses consistently.
   - Preserve React Query query/mutation boundaries already used by feature modules.

4. **Complete workflow integration**
   - Wire patient list/profile to `/api/patients`.
   - Wire appointments to `/api/appointments`.
   - Wire visits to `/api/visits` and `/api/patients/:patientId/visits`.
   - Wire prescriptions to `/api/visits/:visitId/prescriptions` and `/api/prescriptions/:id/pdf`.
   - Wire dashboards to `/api/dashboard/*`.

5. **Finish incomplete frontend routes**
   - Implement payments UI or clearly defer it in navigation.
   - Implement settings UI or clearly defer it in navigation.

6. **Run smoke validation**
   - Validate `/doctor`, `/secretary`, `/patients`, `/patients/:patientId`, `/visits/:visitId`, `/visits/:visitId/prescriptions/new`, and `/appointments`.
   - Confirm role redirects and forbidden route behavior.

7. **Apply UI Kit refinement if desired**
   - Use `Ui_Kit/` as visual reference for SPEC 03.
   - Keep the existing component architecture and avoid duplicating UI code.

## 13. Recommended Next Steps In Priority Order

1. Run backend validation: typecheck, lint, test, build.
2. Run frontend validation: typecheck, lint, build.
3. Add a real frontend test script or test runner configuration for existing `.test.tsx` files.
4. Verify and fix the payments summary route ordering risk.
5. Replace `frontend/src/features/shared/workflow-api.ts` mock behavior with live backend API integration.
6. Reconcile backend and frontend status enums for appointments, visits, and prescriptions.
7. Complete browser smoke validation for all SPEC 02 workflow routes.
8. Implement or intentionally hide/defer `/payments` and `/settings` placeholders.
9. Review production environment hardening, especially JWT secret and seed credentials.
10. Decide whether SPEC 03 UI kit work is a visual refinement pass or a larger screen rebuild.
