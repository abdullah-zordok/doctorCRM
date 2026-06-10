# Tasks: Administrative Workflow

**Input**: Design documents from `specs/002-administrative-workflow/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included for contract, integration, security, validation, and
service behavior because the constitution and plan require critical backend
coverage.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no
  dependency on incomplete tasks in the same phase
- **[Story]**: Maps to a user story from `spec.md`
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the administrative module and test structure.

- [X] T001 Create administrative module directories in backend/src/modules/secretaries, backend/src/modules/clinics, backend/src/modules/patients, and backend/src/modules/appointments
- [X] T002 [P] Create shared administrative test fixtures in backend/tests/helpers/admin-fixtures.ts
- [X] T003 [P] Create shared authenticated request helpers for Doctor and Secretary tokens in backend/tests/helpers/auth-fixtures.ts
- [X] T004 [P] Create shared Prisma mock reset helper in backend/tests/helpers/prisma-mock.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared data and utility foundations that all user stories need.

**CRITICAL**: No user story implementation should begin until this phase is
complete.

- [X] T005 Extend Prisma schema with Clinic, Patient, AppointmentStatus, Appointment, and model relations in backend/prisma/schema.prisma
- [X] T006 Create the administrative workflow Prisma migration in backend/prisma/migrations/
- [X] T007 [P] Create shared pagination parsing and metadata helpers in backend/src/lib/pagination.ts
- [X] T008 [P] Create shared administrative validation helpers for ids, booleans, dates, and pagination in backend/src/lib/admin-validation.ts
- [X] T009 [P] Create shared administrative response types for paginated lists in backend/src/lib/responses.ts

**Checkpoint**: Database models and shared helpers are ready; story work can
start.

---

## Phase 3: User Story 1 - Doctor Sets Up Administration (Priority: P1) MVP

**Goal**: Doctor can manage Secretary accounts and Clinics, and Secretaries are
blocked from Doctor-only administration.

**Independent Test**: Sign in as Doctor, create/update/list/status-change one
Secretary and one Clinic, then sign in as Secretary and verify Doctor-only
operations are denied.

### Tests for User Story 1

Write these tests first and confirm they fail before implementation.

- [X] T010 [P] [US1] Add contract tests for Secretary list/create/get/update/status endpoints in backend/tests/contract/admin-secretaries.test.ts
- [X] T011 [P] [US1] Add contract tests for Clinic list/create/get/update/status endpoints in backend/tests/contract/admin-clinics.test.ts
- [X] T012 [P] [US1] Add Doctor administration integration test for creating and updating a Secretary and Clinic in backend/tests/integration/doctor-administration.test.ts
- [X] T013 [P] [US1] Add Secretary forbidden-access integration test for Secretary and Clinic mutation attempts in backend/tests/integration/secretary-admin-forbidden.test.ts

### Implementation for User Story 1

- [X] T014 [P] [US1] Implement Secretary request schemas and sanitization rules in backend/src/modules/secretaries/secretaries.validation.ts
- [X] T015 [P] [US1] Implement Clinic request schemas and sanitization rules in backend/src/modules/clinics/clinics.validation.ts
- [X] T016 [US1] Implement Secretary service using User role SECRETARY and password hashing in backend/src/modules/secretaries/secretaries.service.ts
- [X] T017 [US1] Implement Clinic service with active-status preservation in backend/src/modules/clinics/clinics.service.ts
- [X] T018 [P] [US1] Implement thin Secretary controller with consistent JSON responses in backend/src/modules/secretaries/secretaries.controller.ts
- [X] T019 [P] [US1] Implement thin Clinic controller with consistent JSON responses in backend/src/modules/clinics/clinics.controller.ts
- [X] T020 [US1] Implement Doctor-only Secretary routes with auth, RBAC, validation, and async handling in backend/src/modules/secretaries/secretaries.routes.ts
- [X] T021 [US1] Implement Clinic routes with Doctor-only mutations and Doctor/Secretary active-list access in backend/src/modules/clinics/clinics.routes.ts
- [X] T022 [US1] Mount Secretary and Clinic routers under /api/users/secretaries and /api/clinics in backend/src/app.ts
- [X] T023 [US1] Register US1 contract and integration tests in backend/scripts/run-tests.ts

**Checkpoint**: User Story 1 is independently functional and testable as the
MVP.

---

## Phase 4: User Story 2 - Secretary Manages Patients (Priority: P2)

**Goal**: Doctor or Secretary can create, update, search, filter, paginate, and
status-change Patients without hard deletion.

**Independent Test**: Sign in as Secretary, use an active Clinic, register a
Patient, update administrative details, search by name or phone, filter by
clinic/status, paginate results, and verify no permanent deletion exists.

### Tests for User Story 2

Write these tests first and confirm they fail before implementation.

- [X] T024 [P] [US2] Add contract tests for Patient list/create/get/update/status endpoints in backend/tests/contract/admin-patients.test.ts
- [X] T025 [P] [US2] Add Secretary patient workflow integration test covering create, update, search, filters, pagination, and status changes in backend/tests/integration/secretary-patients.test.ts
- [X] T026 [P] [US2] Add Patient service unit tests for active clinic validation, duplicate phone allowance, and no-hard-delete behavior in backend/tests/unit/patients.service.test.ts

### Implementation for User Story 2

- [X] T027 [P] [US2] Implement Patient request schemas for body, params, search, filters, pagination, and status in backend/src/modules/patients/patients.validation.ts
- [X] T028 [US2] Implement Patient service with active clinic validation, search, filters, pagination, and status changes in backend/src/modules/patients/patients.service.ts
- [X] T029 [US2] Implement thin Patient controller with consistent JSON responses in backend/src/modules/patients/patients.controller.ts
- [X] T030 [US2] Implement Patient routes with Doctor/Secretary auth, RBAC, validation, and async handling in backend/src/modules/patients/patients.routes.ts
- [X] T031 [US2] Mount Patient router under /api/patients in backend/src/app.ts
- [X] T032 [US2] Register US2 contract, integration, and unit tests in backend/scripts/run-tests.ts

**Checkpoint**: User Stories 1 and 2 work independently, with Patients ready for
appointment scheduling.

---

## Phase 5: User Story 3 - Staff Manage Appointments (Priority: P3)

**Goal**: Doctor or Secretary can create, update, list, filter, and cancel
Appointments for active Patients and Clinics without creating medical or payment
records.

**Independent Test**: Create an Appointment for an active Patient and Clinic,
update administrative details, cancel it by status change, and verify listing by
date, clinic, patient, status, and pagination.

### Tests for User Story 3

Write these tests first and confirm they fail before implementation.

- [X] T033 [P] [US3] Add contract tests for Appointment list/create/get/update/status endpoints in backend/tests/contract/admin-appointments.test.ts
- [X] T034 [P] [US3] Add appointment workflow integration test covering create, update, cancel, and filters in backend/tests/integration/staff-appointments.test.ts
- [X] T035 [P] [US3] Add Appointment service unit tests for inactive patient rejection, inactive clinic rejection, status idempotency, and no-hard-delete behavior in backend/tests/unit/appointments.service.test.ts

### Implementation for User Story 3

- [X] T036 [P] [US3] Implement Appointment request schemas for body, params, date filters, pagination, and status in backend/src/modules/appointments/appointments.validation.ts
- [X] T037 [US3] Implement Appointment service with active patient/clinic validation, filters, pagination, updates, and cancellation status preservation in backend/src/modules/appointments/appointments.service.ts
- [X] T038 [US3] Implement thin Appointment controller with consistent JSON responses in backend/src/modules/appointments/appointments.controller.ts
- [X] T039 [US3] Implement Appointment routes with Doctor/Secretary auth, RBAC, validation, and async handling in backend/src/modules/appointments/appointments.routes.ts
- [X] T040 [US3] Mount Appointment router under /api/appointments in backend/src/app.ts
- [X] T041 [US3] Register US3 contract, integration, and unit tests in backend/scripts/run-tests.ts

**Checkpoint**: All administrative user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify quality, Docker runtime behavior, and documentation.

- [X] T042 [P] Update quickstart verification details after implementation in specs/002-administrative-workflow/quickstart.md
- [X] T043 [P] Reconcile implemented endpoint behavior with OpenAPI contract in specs/002-administrative-workflow/contracts/administrative-workflow.openapi.yaml
- [X] T044 Run backend typecheck, lint, and test commands defined in backend/package.json
- [X] T045 Verify Docker Compose startup, migrations, and health smoke flow using docker-compose.yml and backend/tests/integration/docker-compose-smoke.test.ts
- [X] T046 Audit administrative route RBAC, validation, sanitization, and no-hard-delete behavior across backend/src/modules/secretaries, backend/src/modules/clinics, backend/src/modules/patients, and backend/src/modules/appointments

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational and uses active Clinic
  data; can be tested with seeded Clinic data or after US1.
- **User Story 3 (Phase 5)**: Depends on Foundational and uses active Patient
  and Clinic data; can be tested with seeded data or after US1 and US2.
- **Polish (Phase 6)**: Depends on all desired stories being complete.

### User Story Completion Order

1. **US1 Doctor Sets Up Administration**: Recommended MVP first because Clinics
   and Secretaries are prerequisites for the normal workflow.
2. **US2 Secretary Manages Patients**: Adds patient administration once Clinic
   data exists.
3. **US3 Staff Manage Appointments**: Adds schedule administration once Patient
   and Clinic data exists.

### Parallel Opportunities

- Setup tasks T002-T004 can run in parallel.
- Foundational helper tasks T007-T009 can run in parallel after T005 is
  understood.
- US1 tests T010-T013 can run in parallel; validation/controller tasks T014,
  T015, T018, and T019 can run in parallel after test expectations are clear.
- US2 tests T024-T026 can run in parallel; T027 can run while service behavior
  is being implemented.
- US3 tests T033-T035 can run in parallel; T036 can run while service behavior
  is being implemented.
- Documentation polish tasks T042 and T043 can run in parallel.

---

## Parallel Example: User Story 1

```text
Task: T010 Add Secretary contract tests in backend/tests/contract/admin-secretaries.test.ts
Task: T011 Add Clinic contract tests in backend/tests/contract/admin-clinics.test.ts
Task: T012 Add Doctor administration integration test in backend/tests/integration/doctor-administration.test.ts
Task: T013 Add Secretary forbidden integration test in backend/tests/integration/secretary-admin-forbidden.test.ts
```

## Parallel Example: User Story 2

```text
Task: T024 Add Patient contract tests in backend/tests/contract/admin-patients.test.ts
Task: T025 Add Secretary patient workflow integration test in backend/tests/integration/secretary-patients.test.ts
Task: T026 Add Patient service unit tests in backend/tests/unit/patients.service.test.ts
```

## Parallel Example: User Story 3

```text
Task: T033 Add Appointment contract tests in backend/tests/contract/admin-appointments.test.ts
Task: T034 Add appointment workflow integration test in backend/tests/integration/staff-appointments.test.ts
Task: T035 Add Appointment service unit tests in backend/tests/unit/appointments.service.test.ts
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for US1.
3. Validate Doctor can manage Secretaries and Clinics and Secretary cannot use
   Doctor-only operations.
4. Stop and demo the administrative setup workflow.

### Incremental Delivery

1. Deliver US1 for administrative setup.
2. Deliver US2 for patient administration.
3. Deliver US3 for appointment administration.
4. Run Phase 6 verification before considering the specification complete.

### Quality Gates

- Each story's tests are written before implementation and initially fail.
- Controllers remain thin; services own business rules.
- Every route uses JWT authentication, RBAC, validation, and sanitization.
- Status changes preserve records; no hard delete endpoint is introduced.
- `pnpm test`, `pnpm build`, and Docker Compose verification pass before final
  handoff.
