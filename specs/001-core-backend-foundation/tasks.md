# Tasks: Core Backend Foundation

**Input**: Design documents from `/specs/001-core-backend-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/auth-foundation.openapi.yaml, quickstart.md

**Tests**: Included for critical authentication, authorization, validation, seed idempotency, readiness, and contract behavior required by the specification success criteria.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently after shared setup and foundational work.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on incomplete tasks.
- **[Story]**: Maps to the user story phase only: [US1], [US2], or [US3].
- Every task includes an exact file path.

## Path Conventions

- Backend project: `backend/src/`, `backend/prisma/`, `backend/tests/`
- Docker runtime: `docker-compose.yml`, `backend/Dockerfile`
- Feature docs: `specs/001-core-backend-foundation/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the backend project, Docker runtime, TypeScript tooling, and test tooling.

- [X] T001 Create backend directory structure from plan in `backend/src/`, `backend/prisma/`, and `backend/tests/`
- [X] T002 Create backend package manifest with app, Prisma, test, lint, and Docker scripts in `backend/package.json`
- [X] T003 [P] Configure TypeScript compiler options for Node.js 20 in `backend/tsconfig.json`
- [X] T004 [P] Configure test runner for Vitest and Supertest in `backend/vitest.config.ts`
- [X] T005 [P] Create environment example with PORT, DATABASE_URL, JWT, and seed variables in `backend/.env.example`
- [X] T006 Create backend container build for dependency install, Prisma generation, and dev startup in `backend/Dockerfile`
- [X] T007 Create Docker Compose services for `postgres` and `backend` with persistent database volume in `docker-compose.yml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish database, environment, response, middleware, and app wiring required before any user story can work.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T008 Define Prisma datasource, client generator, Role enum, and User model in `backend/prisma/schema.prisma`
- [X] T009 Implement idempotent initial Doctor seed using configurable credentials in `backend/prisma/seed.ts`
- [X] T010 Implement validated environment loader for required runtime settings in `backend/src/config/env.ts`
- [X] T011 Create shared Prisma client instance in `backend/src/lib/prisma.ts`
- [X] T012 Create consistent success and error JSON response helpers in `backend/src/lib/responses.ts`
- [X] T013 [P] Create async request wrapper utility in `backend/src/utils/async-handler.ts`
- [X] T014 Create global validation and sanitization middleware for body, query, and params in `backend/src/middleware/validate.middleware.ts`
- [X] T015 Create global error middleware that maps validation, auth, forbidden, and unexpected failures in `backend/src/middleware/error.middleware.ts`
- [X] T016 [P] Create rate-limit middleware for authentication-sensitive routes in `backend/src/middleware/rate-limit.middleware.ts`
- [X] T017 [P] Add Express request user typing for authenticated requests in `backend/src/types/express.d.ts`
- [X] T018 Create Express application wiring with security, JSON parsing, routing, and error handling in `backend/src/app.ts`
- [X] T019 Create HTTP server bootstrap using validated environment configuration in `backend/src/server.ts`

**Checkpoint**: Backend project compiles, shared app wiring exists, and user stories can now be implemented.

---

## Phase 3: User Story 1 - Doctor Signs In (Priority: P1) MVP

**Goal**: The seeded Doctor can sign in and receive a safe identity summary plus access token.

**Independent Test**: Start from a fresh database, seed the Doctor account, submit valid and invalid login credentials, and verify success or rejection without exposing password or account existence details.

### Tests for User Story 1

- [X] T020 [P] [US1] Add POST /api/auth/login contract tests for success, invalid password, validation error, and password omission in `backend/tests/contract/auth-login.test.ts`
- [X] T021 [P] [US1] Add Doctor login integration flow using seeded credentials in `backend/tests/integration/doctor-login.test.ts`
- [X] T022 [P] [US1] Add AuthService unit tests for password verification, inactive user rejection, and safe user output in `backend/tests/unit/auth.service.test.ts`

### Implementation for User Story 1

- [X] T023 [US1] Implement login request schema with email normalization and password validation in `backend/src/modules/auth/auth.validation.ts`
- [X] T024 [US1] Implement safe user lookup helpers that never return passwordHash in `backend/src/modules/users/user.service.ts`
- [X] T025 [US1] Implement login, password hash verification, JWT signing, and safe auth payload creation in `backend/src/modules/auth/auth.service.ts`
- [X] T026 [US1] Implement thin login controller using AuthService and response helpers in `backend/src/modules/auth/auth.controller.ts`
- [X] T027 [US1] Implement auth routes for POST /api/auth/login with validation and rate limiting in `backend/src/modules/auth/auth.routes.ts`
- [X] T028 [US1] Register auth routes under /api/auth in `backend/src/app.ts`

**Checkpoint**: User Story 1 is independently functional when Doctor login tests pass.

---

## Phase 4: User Story 2 - Protected Access Is Enforced (Priority: P2)

**Goal**: Protected operations reject missing, invalid, expired, tampered, inactive, or wrong-role access while allowing valid Doctor access.

**Independent Test**: Call protected endpoints with no token, bad token, valid Doctor token, inactive user token, and wrong-role user token; verify unauthorized or forbidden JSON responses as appropriate.

### Tests for User Story 2

- [X] T029 [P] [US2] Add GET /api/auth/me and POST /api/auth/logout contract tests for authenticated and unauthenticated cases in `backend/tests/contract/auth-protected.test.ts`
- [X] T030 [P] [US2] Add protected access integration tests for missing, malformed, expired, tampered, inactive, and valid tokens in `backend/tests/integration/protected-access.test.ts`
- [X] T031 [P] [US2] Add role middleware unit tests for Doctor allowed, Secretary forbidden, and missing user forbidden cases in `backend/tests/unit/role.middleware.test.ts`

### Implementation for User Story 2

- [X] T032 [US2] Implement JWT authentication middleware with active-user lookup in `backend/src/middleware/auth.middleware.ts`
- [X] T033 [US2] Implement Doctor/Secretary role guard middleware with consistent forbidden errors in `backend/src/middleware/role.middleware.ts`
- [X] T034 [US2] Extend AuthService with current-user safe summary and logout acknowledgement behavior in `backend/src/modules/auth/auth.service.ts`
- [X] T035 [US2] Extend AuthController with GET /me and POST /logout handlers in `backend/src/modules/auth/auth.controller.ts`
- [X] T036 [US2] Register protected GET /api/auth/me and POST /api/auth/logout routes in `backend/src/modules/auth/auth.routes.ts`
- [X] T037 [US2] Ensure authentication and authorization errors use the shared JSON error shape in `backend/src/middleware/error.middleware.ts`

**Checkpoint**: User Story 2 is independently functional when protected access tests pass without changing User Story 1 behavior.

---

## Phase 5: User Story 3 - Foundation Starts Reliably (Priority: P3)

**Goal**: The complete local foundation starts with Docker Compose, exposes readiness feedback, runs migrations, and seeds exactly one active Doctor account.

**Independent Test**: Start from a clean checkout, run Docker Compose, apply migrations, run seed multiple times, check readiness, and verify one active Doctor can sign in.

### Tests for User Story 3

- [X] T038 [P] [US3] Add readiness endpoint integration test that verifies backend and database availability in `backend/tests/integration/health-readiness.test.ts`
- [X] T039 [P] [US3] Add seed idempotency integration test that verifies repeated seed execution leaves one active Doctor in `backend/tests/integration/seed-idempotency.test.ts`
- [X] T040 [P] [US3] Add Docker Compose smoke test script for health, migration, seed, login, me, and logout checks in `backend/tests/integration/docker-compose-smoke.test.ts`

### Implementation for User Story 3

- [X] T041 [US3] Implement database-backed readiness check service in `backend/src/modules/health/health.service.ts`
- [X] T042 [US3] Implement thin health controller returning consistent JSON readiness response in `backend/src/modules/health/health.controller.ts`
- [X] T043 [US3] Implement GET /api/health route in `backend/src/modules/health/health.routes.ts`
- [X] T044 [US3] Register health routes under /api/health in `backend/src/app.ts`
- [X] T045 [US3] Add migration, seed, dev, build, start, test, and prisma scripts in `backend/package.json`
- [X] T046 [US3] Document Docker Compose startup, migration, seed, login, me, logout, and readiness commands in `specs/001-core-backend-foundation/quickstart.md`

**Checkpoint**: User Story 3 is independently functional when quickstart commands pass from a clean checkout.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, security hardening, documentation consistency, and scope guardrails across all stories.

- [X] T047 [P] Verify OpenAPI contract matches implemented responses and update `specs/001-core-backend-foundation/contracts/auth-foundation.openapi.yaml`
- [X] T048 [P] Add README usage notes linking Spec 001 quickstart and Docker commands in `README.md`
- [X] T049 Run full backend typecheck, tests, and build scripts and record required command updates in `backend/package.json`
- [X] T050 Verify no out-of-scope patient, clinic, appointment, visit, prescription, payment, dashboard, notification, file-upload, or frontend code was added in `specs/001-core-backend-foundation/tasks.md`
- [X] T051 Review security headers, CORS defaults, rate limits, password exposure, and error details in `backend/src/app.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies.
- **Phase 2 Foundational**: Depends on Phase 1.
- **Phase 3 US1**: Depends on Phase 2.
- **Phase 4 US2**: Depends on Phase 2 and uses US1 login/token behavior for integration verification.
- **Phase 5 US3**: Depends on Phase 2 and validates the complete environment including US1 and US2 endpoints.
- **Phase 6 Polish**: Depends on all desired user stories.

### User Story Dependencies

- **US1 Doctor Signs In**: First MVP slice. No story dependency after shared foundation.
- **US2 Protected Access Is Enforced**: Can start after foundation, but integration tests need login behavior from US1.
- **US3 Foundation Starts Reliably**: Can start after foundation, but final smoke validation uses US1 and US2 behavior.

### Within Each User Story

- Write tests first and confirm they fail before implementation.
- Implement validation before controllers.
- Implement services before controllers.
- Implement controllers before route registration.
- Validate each story independently before starting the next story.

### Parallel Opportunities

- Setup tasks T003, T004, and T005 can run in parallel after T001.
- Foundational tasks T013, T016, and T017 can run in parallel after package setup.
- US1 test tasks T020, T021, and T022 can run in parallel.
- US2 test tasks T029, T030, and T031 can run in parallel.
- US3 test tasks T038, T039, and T040 can run in parallel.
- Polish tasks T047 and T048 can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 tests together:
Task: "T020 [P] [US1] Add POST /api/auth/login contract tests in backend/tests/contract/auth-login.test.ts"
Task: "T021 [P] [US1] Add Doctor login integration flow in backend/tests/integration/doctor-login.test.ts"
Task: "T022 [P] [US1] Add AuthService unit tests in backend/tests/unit/auth.service.test.ts"
```

## Parallel Example: User Story 2

```bash
# Launch User Story 2 tests together:
Task: "T029 [P] [US2] Add protected route contract tests in backend/tests/contract/auth-protected.test.ts"
Task: "T030 [P] [US2] Add protected access integration tests in backend/tests/integration/protected-access.test.ts"
Task: "T031 [P] [US2] Add role middleware unit tests in backend/tests/unit/role.middleware.test.ts"
```

## Parallel Example: User Story 3

```bash
# Launch User Story 3 tests together:
Task: "T038 [P] [US3] Add readiness integration test in backend/tests/integration/health-readiness.test.ts"
Task: "T039 [P] [US3] Add seed idempotency integration test in backend/tests/integration/seed-idempotency.test.ts"
Task: "T040 [P] [US3] Add Docker Compose smoke test in backend/tests/integration/docker-compose-smoke.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: Doctor Signs In.
4. Stop and validate login contract, integration, and unit tests.

### Incremental Delivery

1. Deliver US1 so the seeded Doctor can sign in.
2. Deliver US2 so all future protected features have reusable authentication and RBAC.
3. Deliver US3 so the full foundation starts, migrates, seeds, and reports readiness repeatably.

### Scope Guardrail

Spec 001 must not implement patients, clinics, appointments, visits,
prescriptions, payments, dashboards, notifications, file uploads, or frontend
work. Those belong to later specifications.
