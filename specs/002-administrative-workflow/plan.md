# Implementation Plan: Administrative Workflow

**Branch**: `002-administrative-workflow` | **Date**: 2026-06-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-administrative-workflow/spec.md`

## Summary

Extend the Spec 001 backend foundation with administrative REST modules for
secretaries, clinics, patients, and appointments. The implementation will reuse
the existing Express, TypeScript, Prisma, PostgreSQL, JWT, RBAC, validation, and
response helpers while adding searchable, paginated, status-preserving
administrative workflows. Medical visits, prescriptions, payments, dashboards,
file uploads, notifications, and frontend behavior remain out of scope.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 LTS

**Primary Dependencies**: Express.js, Prisma ORM, PostgreSQL, Zod, JWT,
bcryptjs, Docker Compose, existing auth/RBAC/validation middleware

**Storage**: PostgreSQL via Prisma migrations extending `User` and adding
`Clinic`, `Patient`, and `Appointment` models

**Testing**: Existing compiled TypeScript test runner with unit, integration,
and contract tests using Node assertions and Supertest

**Target Platform**: Docker Compose local/runtime environment

**Project Type**: Backend REST API service

**Performance Goals**: Administrative list, search, and filter endpoints return
within 500ms for seeded test data; paginated responses never exceed requested
page size

**Constraints**: Backend-only; Docker Compose required; no hard deletion for
administrative records; controllers stay thin; business rules live in services;
all protected operations require JWT, RBAC, validation, sanitization, and
consistent JSON responses

**Scale/Scope**: Single-doctor MVP with multiple secretaries, clinics,
patients, and appointments; schema and modules must not block later SaaS tenant
or multiple-doctor support

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Backend-first scope: PASS - all behavior is expressed as REST contracts,
  Prisma data, auth/RBAC, validation, and service rules.
- Approved stack: PASS - the plan keeps Node.js, TypeScript, Express.js,
  PostgreSQL, Prisma ORM, JWT, Docker, and Docker Compose.
- Modular architecture: PASS - four administrative domain modules are planned,
  with controllers limited to HTTP mapping and services owning business logic.
- Security and validation: PASS - every endpoint requires JWT, role checks,
  request validation, sanitization, and consistent errors.
- Historical integrity: PASS - status changes replace hard deletion for
  secretaries, clinics, patients, and appointments.
- Prescription output: PASS - prescriptions and PDF generation are intentionally
  deferred and not altered by this feature.
- Extensibility: PASS - model boundaries leave room for doctor ownership and
  future tenant scoping without changing API concepts.

## Project Structure

### Documentation (this feature)

```text
specs/002-administrative-workflow/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- administrative-workflow.openapi.yaml
`-- tasks.md
```

### Source Code (repository root)

```text
backend/
|-- prisma/
|   |-- schema.prisma
|   `-- migrations/
|-- src/
|   |-- app.ts
|   |-- lib/
|   |   |-- pagination.ts
|   |   |-- prisma.ts
|   |   `-- responses.ts
|   |-- middleware/
|   |-- modules/
|   |   |-- appointments/
|   |   |   |-- appointments.controller.ts
|   |   |   |-- appointments.routes.ts
|   |   |   |-- appointments.service.ts
|   |   |   `-- appointments.validation.ts
|   |   |-- clinics/
|   |   |   |-- clinics.controller.ts
|   |   |   |-- clinics.routes.ts
|   |   |   |-- clinics.service.ts
|   |   |   `-- clinics.validation.ts
|   |   |-- patients/
|   |   |   |-- patients.controller.ts
|   |   |   |-- patients.routes.ts
|   |   |   |-- patients.service.ts
|   |   |   `-- patients.validation.ts
|   |   `-- secretaries/
|   |       |-- secretaries.controller.ts
|   |       |-- secretaries.routes.ts
|   |       |-- secretaries.service.ts
|   |       `-- secretaries.validation.ts
|   `-- utils/
|-- tests/
|   |-- contract/
|   |-- integration/
|   `-- unit/
docker-compose.yml
```

**Structure Decision**: Keep the existing single backend package. Add one module
per administrative domain under `backend/src/modules`, shared pagination in
`backend/src/lib`, Prisma schema changes in `backend/prisma`, and focused tests
under the existing `backend/tests` layers.

## Complexity Tracking

No constitution violations.

## Phase 0: Research

Research decisions are captured in [research.md](./research.md). All
implementation choices use existing project patterns and avoid new frameworks.

## Phase 1: Design

Design artifacts are captured in:

- [data-model.md](./data-model.md)
- [contracts/administrative-workflow.openapi.yaml](./contracts/administrative-workflow.openapi.yaml)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Backend-first scope: PASS - contracts, data model, and quickstart cover only
  API workflows.
- Approved stack: PASS - no dependency or runtime substitution introduced.
- Modular architecture: PASS - controller, service, route, and validation files
  are defined per domain.
- Security and validation: PASS - contracts require bearer auth and describe
  role-specific access.
- Historical integrity: PASS - data model uses active flags/status transitions
  instead of hard deletion.
- Prescription output: PASS - prescription PDFs remain excluded for a later
  specification.
- Extensibility: PASS - entities can accept future doctor/tenant ownership
  fields without changing current workflow semantics.
