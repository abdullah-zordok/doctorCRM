# Implementation Plan: Medical & Financial Workflow

**Branch**: `003-medical-financial-workflow` | **Date**: 2026-06-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-medical-financial-workflow/spec.md`

## Summary

Extend the existing backend with medical visits, diagnosis and treatment
tracking, prescriptions with reproducible PDFs, payments with balance
calculation, and role-scoped Doctor/Secretary dashboards. The implementation
will build on Spec 001 authentication/RBAC and Spec 002 patient, clinic, and
appointment modules. Medical, prescription, and financial corrections will be
stored as historical revisions instead of destructive overwrites.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 LTS

**Primary Dependencies**: Express.js, Prisma ORM, PostgreSQL, Zod, JWT/RBAC
middleware, Docker Compose, existing pagination/validation/response helpers,
PDFKit for prescription PDF generation

**Storage**: PostgreSQL via Prisma migrations extending existing User, Clinic,
Patient, and Appointment models with Visit, VisitRevision, Prescription,
PrescriptionRevision, Payment, PaymentRevision, and PaymentMethod

**Testing**: Existing compiled TypeScript test runner with Node assertions,
Supertest contract/integration tests, and service unit tests for medical,
financial, RBAC, validation, and PDF behavior

**Target Platform**: Docker Compose backend and PostgreSQL runtime

**Project Type**: Backend REST API service

**Performance Goals**: Medical and payment list/filter responses return within
500ms for seeded test data; prescription PDFs are generated within 2 seconds for
standard prescriptions; dashboard summaries return within 1 second for seeded
test data

**Constraints**: Backend-only; Docker Compose required; no frontend, uploads,
insurance, notifications, OCR, multi-doctor, or SaaS tenant behavior; no hard
deletion or destructive overwrite of medical/prescription/financial records;
Doctor-only clinical writes; Secretary payment writes and limited dashboard
reads only

**Scale/Scope**: Single-doctor MVP with multiple clinics, patients, visits,
prescriptions, payments, and dashboard summaries; schema keeps explicit Doctor
and Clinic ownership for future SaaS and multiple-doctor support

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Backend-first scope: PASS - behavior is defined through backend data,
  contracts, auth/RBAC, validation, PDFs, and reporting operations.
- Approved stack: PASS - Node.js, TypeScript, Express.js, PostgreSQL, Prisma
  ORM, JWT, Docker, and Docker Compose remain the runtime foundation.
- Modular architecture: PASS - visits, prescriptions, payments, and dashboards
  are planned as separate modules with thin controllers and service-owned rules.
- Security and validation: PASS - every route is protected, role-scoped,
  validated, sanitized, and returns consistent JSON errors.
- Historical integrity: PASS - visit, prescription, and payment corrections use
  revision records instead of overwriting prior facts.
- Prescription output: PASS - PDFs are generated from stored prescription,
  visit, patient, and Doctor data.
- Extensibility: PASS - records keep Patient, Clinic, Doctor, and future tenant
  boundaries explicit.

## Project Structure

### Documentation (this feature)

```text
specs/003-medical-financial-workflow/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- medical-financial-workflow.openapi.yaml
`-- tasks.md
```

### Source Code (repository root)

```text
backend/
|-- package.json
|-- prisma/
|   |-- schema.prisma
|   `-- migrations/
|-- src/
|   |-- app.ts
|   |-- lib/
|   |   |-- decimal.ts
|   |   |-- pdf.ts
|   |   |-- prisma.ts
|   |   `-- responses.ts
|   |-- modules/
|   |   |-- dashboards/
|   |   |   |-- dashboards.controller.ts
|   |   |   |-- dashboards.routes.ts
|   |   |   |-- dashboards.service.ts
|   |   |   `-- dashboards.validation.ts
|   |   |-- payments/
|   |   |   |-- payments.controller.ts
|   |   |   |-- payments.routes.ts
|   |   |   |-- payments.service.ts
|   |   |   `-- payments.validation.ts
|   |   |-- prescriptions/
|   |   |   |-- prescriptions.controller.ts
|   |   |   |-- prescriptions.pdf.ts
|   |   |   |-- prescriptions.routes.ts
|   |   |   |-- prescriptions.service.ts
|   |   |   `-- prescriptions.validation.ts
|   |   `-- visits/
|   |       |-- visits.controller.ts
|   |       |-- visits.routes.ts
|   |       |-- visits.service.ts
|   |       `-- visits.validation.ts
|   `-- middleware/
|-- tests/
|   |-- contract/
|   |-- integration/
|   `-- unit/
docker-compose.yml
```

**Structure Decision**: Keep the existing single backend package and add one
module per Spec 003 domain. PDF generation stays isolated in the prescriptions
module, financial arithmetic helpers stay shared, and all Prisma schema changes
live in `backend/prisma`.

## Complexity Tracking

No constitution violations.

## Phase 0: Research

Research decisions are captured in [research.md](./research.md). No unresolved
clarifications remain.

## Phase 1: Design

Design artifacts are captured in:

- [data-model.md](./data-model.md)
- [contracts/medical-financial-workflow.openapi.yaml](./contracts/medical-financial-workflow.openapi.yaml)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Backend-first scope: PASS - REST contracts and data model cover all behavior
  before any UI work.
- Approved stack: PASS - no runtime substitution is introduced.
- Modular architecture: PASS - all new domains have module boundaries and
  service-owned rules.
- Security and validation: PASS - contracts define bearer auth and role-scoped
  operations.
- Historical integrity: PASS - revisions preserve prior clinical,
  prescription, and payment facts.
- Prescription output: PASS - PDF output is derived from persisted
  prescription records.
- Extensibility: PASS - ownership fields keep future SaaS and multiple-doctor
  support viable.
