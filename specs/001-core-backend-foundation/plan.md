# Implementation Plan: Core Backend Foundation

**Branch**: `001-core-backend-foundation` | **Date**: 2026-06-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-core-backend-foundation/spec.md`

## Summary

Build the backend foundation for the Doctor Clinic Management System: Dockerized
runtime, PostgreSQL persistence, Prisma migrations and seeding, Express API
structure, JWT authentication, Doctor/Secretary RBAC, request validation,
sanitization, consistent JSON responses, global errors, and readiness checks.
No patient, clinic, appointment, visit, prescription, payment, dashboard, file
upload, notification, or frontend workflows are included in this specification.

## Technical Context

**Language/Version**: TypeScript on Node.js 20 LTS

**Primary Dependencies**: Express.js, Prisma ORM, jsonwebtoken, bcrypt, Zod,
helmet, cors, express-rate-limit, morgan, Vitest, Supertest, Docker Compose

**Storage**: PostgreSQL via Prisma schema, migrations, and seed script

**Testing**: Vitest for unit/integration tests, Supertest for HTTP contract and
route behavior tests

**Target Platform**: Docker Compose local/runtime environment with `postgres`
and `backend` services

**Project Type**: Backend REST API service

**Performance Goals**: Authentication, current-user lookup, logout, and health
checks return within 500 ms under local development load

**Constraints**: Entire project starts with `docker compose up --build`; all
protected routes require JWT authentication and active-user checks; controllers
remain thin; services own business logic

**Scale/Scope**: MVP is single-doctor but foundations must not block multiple
clinics, multiple secretaries, or future SaaS/multiple-doctor expansion

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Backend-first scope: PASS. This plan defines API, data, auth/RBAC, validation,
  and operational behavior only.
- Approved stack: PASS. Node.js, TypeScript, Express.js, PostgreSQL, Prisma,
  JWT, Docker, and Docker Compose are used without substitution.
- Modular architecture: PASS. Source structure uses domain modules with thin
  controllers and service-owned business logic.
- Security and validation: PASS. Every protected endpoint requires JWT, role
  checks where needed, validation, sanitization, and consistent JSON errors.
- Historical integrity: PASS. Spec 001 does not create medical or financial
  records; user status changes use non-destructive state.
- Prescription output: PASS. Prescription PDFs are excluded from this spec and
  reserved for the medical workflow.
- Extensibility: PASS. User and role foundations avoid assumptions that block
  multiple clinics, secretaries, future SaaS, or multiple doctors.

## Project Structure

### Documentation (this feature)

```text
specs/001-core-backend-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── auth-foundation.openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
docker-compose.yml

backend/
├── Dockerfile
├── package.json
├── tsconfig.json
├── .env.example
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   └── env.ts
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── responses.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   ├── role.middleware.ts
│   │   └── validate.middleware.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   ├── health/
│   │   │   ├── health.controller.ts
│   │   │   ├── health.routes.ts
│   │   │   └── health.service.ts
│   │   └── users/
│   │       └── user.service.ts
│   ├── types/
│   │   └── express.d.ts
│   └── utils/
│       └── async-handler.ts
└── tests/
    ├── contract/
    │   └── auth-foundation.test.ts
    ├── integration/
    │   └── auth-flow.test.ts
    └── unit/
        ├── auth.service.test.ts
        └── role.middleware.test.ts
```

**Structure Decision**: Use a single backend service under `backend/`, grouped
by domain modules. Controllers translate HTTP concerns only; services contain
authentication, user lookup, role, and readiness behavior. Docker Compose sits
at the repository root and orchestrates both backend and database services.

## Complexity Tracking

No constitution violations or complexity exceptions are required.

## Phase 0 Research Summary

Research decisions are documented in [research.md](./research.md). All
technical unknowns from the template were resolved before design.

## Phase 1 Design Summary

- Data model: [data-model.md](./data-model.md)
- API contract: [contracts/auth-foundation.openapi.yaml](./contracts/auth-foundation.openapi.yaml)
- Validation and startup guide: [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Backend-first scope: PASS. Contracts and quickstart cover backend behavior
  only.
- Approved stack: PASS. Design artifacts use the approved stack.
- Modular architecture: PASS. Contract endpoints map to auth, health, and user
  service boundaries.
- Security and validation: PASS. Login, current-user, logout, role, active-user,
  validation, and error behavior are covered.
- Historical integrity: PASS. No medical or financial data is in scope.
- Prescription output: PASS. No prescription behavior is in scope.
- Extensibility: PASS. User role/status model can support later secretary
  management and future multi-doctor expansion.
