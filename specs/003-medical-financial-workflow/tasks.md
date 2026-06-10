# Tasks: Medical & Financial Workflow

**Input**: Design documents from `specs/003-medical-financial-workflow/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included for contract, integration, medical history, prescription
PDF, financial validation, RBAC, and dashboard behavior because the plan and
constitution require critical medical, financial, security, validation, and
contract coverage.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no
  dependency on incomplete tasks in the same phase
- **[Story]**: Maps to a user story from `spec.md`
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare dependencies, modules, shared helpers, and fixtures for
medical and financial workflows.

- [X] T001 Create Spec 003 module directories in backend/src/modules/visits, backend/src/modules/prescriptions, backend/src/modules/payments, and backend/src/modules/dashboards
- [X] T002 Add PDFKit dependency and type definitions for prescription PDFs in backend/package.json and backend/pnpm-lock.yaml
- [X] T003 [P] Create shared decimal amount helpers for financial validation in backend/src/lib/decimal.ts
- [X] T004 [P] Create shared PDF response helper for generated documents in backend/src/lib/pdf.ts
- [X] T005 [P] Extend clinical and financial test fixtures in backend/tests/helpers/admin-fixtures.ts
- [X] T006 [P] Extend Prisma mock reset helper for visit, prescription, and payment delegates in backend/tests/helpers/prisma-mock.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared schema, migrations, and validation utilities required by
all user stories.

**CRITICAL**: No user story implementation should begin until this phase is
complete.

- [X] T007 Extend Prisma schema with VisitStatus, PrescriptionStatus, PaymentMethod, Visit, VisitRevision, Prescription, PrescriptionRevision, Payment, and PaymentRevision in backend/prisma/schema.prisma
- [X] T008 Create the medical and financial workflow Prisma migration in backend/prisma/migrations/
- [X] T009 [P] Add shared date range and optional enum validation helpers in backend/src/lib/admin-validation.ts
- [X] T010 [P] Add shared money response typing for decimal string output in backend/src/lib/responses.ts
- [X] T011 Run Prisma client generation for new medical and financial models using backend/prisma/schema.prisma

**Checkpoint**: Schema, shared helpers, and generated client are ready for user
story work.

---

## Phase 3: User Story 1 - Doctor Records Medical Visit (Priority: P1) MVP

**Goal**: Doctor can create, view, list, and correct medical visits for existing
patients and clinics while Secretaries are denied clinical writes.

**Independent Test**: Sign in as Doctor, create a visit for an existing patient
and clinic, correct diagnosis/treatment details, verify a VisitRevision is
created, and verify Secretary visit mutation attempts are denied.

### Tests for User Story 1

Write these tests first and confirm they fail before implementation.

- [X] T012 [P] [US1] Add contract tests for visit list/create/get/update endpoints in backend/tests/contract/medical-visits.test.ts
- [X] T013 [P] [US1] Add Doctor visit workflow integration test covering create, correction, and revision preservation in backend/tests/integration/doctor-visits.test.ts
- [X] T014 [P] [US1] Add Secretary forbidden clinical write integration test in backend/tests/integration/secretary-clinical-forbidden.test.ts
- [X] T015 [P] [US1] Add Visit service unit tests for active patient validation, active clinic validation, and revision creation in backend/tests/unit/visits.service.test.ts

### Implementation for User Story 1

- [X] T016 [P] [US1] Implement Visit request schemas for params, filters, creation, and correction in backend/src/modules/visits/visits.validation.ts
- [X] T017 [US1] Implement Visit service with Doctor ownership, active patient/clinic validation, listing filters, and VisitRevision preservation in backend/src/modules/visits/visits.service.ts
- [X] T018 [US1] Implement thin Visit controller with consistent JSON responses in backend/src/modules/visits/visits.controller.ts
- [X] T019 [US1] Implement Visit routes with Doctor-only mutations, authenticated reads, validation, and async handling in backend/src/modules/visits/visits.routes.ts
- [X] T020 [US1] Mount Visit router under /api/patients/:patientId/visits and /api/visits in backend/src/app.ts
- [X] T021 [US1] Register US1 contract, integration, and unit tests in backend/scripts/run-tests.ts

**Checkpoint**: User Story 1 is independently functional and testable as the
MVP.

---

## Phase 4: User Story 2 - Doctor Manages Prescriptions and PDFs (Priority: P2)

**Goal**: Doctor can create, view, correct, and generate PDFs for prescriptions
linked to existing visits while preserving prescription correction history.

**Independent Test**: Sign in as Doctor, create a prescription for a visit,
correct it, verify a PrescriptionRevision is created, generate a PDF, and verify
Secretary prescription mutation attempts are denied.

### Tests for User Story 2

Write these tests first and confirm they fail before implementation.

- [X] T022 [P] [US2] Add contract tests for prescription create/get/update/pdf endpoints in backend/tests/contract/medical-prescriptions.test.ts
- [X] T023 [P] [US2] Add Doctor prescription and PDF integration test in backend/tests/integration/doctor-prescriptions-pdf.test.ts
- [X] T024 [P] [US2] Add Prescription service unit tests for visit validation and revision preservation in backend/tests/unit/prescriptions.service.test.ts
- [X] T025 [P] [US2] Add Prescription PDF unit test verifying stored data appears in generated PDF output in backend/tests/unit/prescriptions.pdf.test.ts

### Implementation for User Story 2

- [X] T026 [P] [US2] Implement Prescription request schemas for medications, instructions, params, and correction reason in backend/src/modules/prescriptions/prescriptions.validation.ts
- [X] T027 [US2] Implement isolated Prescription PDF generator using stored prescription, visit, patient, clinic, and Doctor data in backend/src/modules/prescriptions/prescriptions.pdf.ts
- [X] T028 [US2] Implement Prescription service with Doctor-only writes, visit validation, correction revisions, and PDF data loading in backend/src/modules/prescriptions/prescriptions.service.ts
- [X] T029 [US2] Implement thin Prescription controller with JSON responses and PDF response handling in backend/src/modules/prescriptions/prescriptions.controller.ts
- [X] T030 [US2] Implement Prescription routes with Doctor-only mutations, authenticated reads, PDF generation, validation, and async handling in backend/src/modules/prescriptions/prescriptions.routes.ts
- [X] T031 [US2] Mount Prescription router under /api/visits/:visitId/prescriptions and /api/prescriptions in backend/src/app.ts
- [X] T032 [US2] Register US2 contract, integration, and unit tests in backend/scripts/run-tests.ts

**Checkpoint**: User Stories 1 and 2 work independently, and prescription PDFs
are reproducible from stored data.

---

## Phase 5: User Story 3 - Staff Register Payments (Priority: P3)

**Goal**: Doctor and Secretary can register, view, list, and correct payments
with accurate remaining balances and preserved financial history.

**Independent Test**: Sign in as Secretary, register a valid payment, verify
remaining balance, reject negative amounts and overpayment, correct a payment,
and verify a PaymentRevision is created.

### Tests for User Story 3

Write these tests first and confirm they fail before implementation.

- [X] T033 [P] [US3] Add contract tests for payment list/create/get/update endpoints and financial summary access in backend/tests/contract/financial-payments.test.ts
- [X] T034 [P] [US3] Add Secretary payment workflow integration test covering valid payment, overpayment rejection, and correction history in backend/tests/integration/secretary-payments.test.ts
- [X] T035 [P] [US3] Add Payment service unit tests for decimal validation, remaining calculation, patient/visit/clinic validation, and PaymentRevision preservation in backend/tests/unit/payments.service.test.ts
- [X] T036 [P] [US3] Add money helper unit tests for non-negative values, scale, and paid-not-over-total rules in backend/tests/unit/decimal.test.ts

### Implementation for User Story 3

- [X] T037 [P] [US3] Implement Payment request schemas for list filters, creation, correction, methods, and amount strings in backend/src/modules/payments/payments.validation.ts
- [X] T038 [US3] Implement Payment service with patient/clinic/optional visit validation, remaining balance calculation, correction revisions, list filters, and Doctor-only detailed summary rules in backend/src/modules/payments/payments.service.ts
- [X] T039 [US3] Implement thin Payment controller with consistent JSON responses in backend/src/modules/payments/payments.controller.ts
- [X] T040 [US3] Implement Payment routes with Doctor/Secretary payment access, Doctor-only detailed summary, validation, and async handling in backend/src/modules/payments/payments.routes.ts
- [X] T041 [US3] Mount Payment router under /api/payments in backend/src/app.ts
- [X] T042 [US3] Register US3 contract, integration, and unit tests in backend/scripts/run-tests.ts

**Checkpoint**: User Stories 1, 2, and 3 work independently with protected
medical and financial history.

---

## Phase 6: User Story 4 - View Operational and Financial Dashboards (Priority: P4)

**Goal**: Doctor and Secretary can view role-appropriate dashboard summaries,
with detailed revenue visible only to Doctors.

**Independent Test**: Sign in as Doctor and verify all required clinical and
revenue metrics; sign in as Secretary and verify limited operational metrics;
verify Secretary detailed financial report access is denied.

### Tests for User Story 4

Write these tests first and confirm they fail before implementation.

- [X] T043 [P] [US4] Add contract tests for Doctor and Secretary dashboard endpoints in backend/tests/contract/dashboards.test.ts
- [X] T044 [P] [US4] Add dashboard RBAC integration test for Doctor summaries, Secretary summaries, and forbidden detailed revenue access in backend/tests/integration/dashboard-rbac.test.ts
- [X] T045 [P] [US4] Add Dashboard service unit tests for total patients, today's appointments, total visits, revenue totals, revenue per clinic, today's registered patients, today's payments, and outstanding balances in backend/tests/unit/dashboards.service.test.ts

### Implementation for User Story 4

- [X] T046 [P] [US4] Implement Dashboard query validation for date range and clinic filters in backend/src/modules/dashboards/dashboards.validation.ts
- [X] T047 [US4] Implement Dashboard service with Doctor and Secretary summary methods over stored patients, appointments, visits, and payments in backend/src/modules/dashboards/dashboards.service.ts
- [X] T048 [US4] Implement thin Dashboard controller with consistent JSON responses in backend/src/modules/dashboards/dashboards.controller.ts
- [X] T049 [US4] Implement Dashboard routes with Doctor-only detailed revenue routes and Secretary operational routes in backend/src/modules/dashboards/dashboards.routes.ts
- [X] T050 [US4] Mount Dashboard router under /api/dashboard in backend/src/app.ts
- [X] T051 [US4] Register US4 contract, integration, and unit tests in backend/scripts/run-tests.ts

**Checkpoint**: All Spec 003 user stories are independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verify quality, documentation, runtime behavior, and scope
boundaries across the full feature.

- [X] T052 [P] Update quickstart verification details after implementation in specs/003-medical-financial-workflow/quickstart.md
- [X] T053 [P] Reconcile implemented endpoint behavior with OpenAPI contract in specs/003-medical-financial-workflow/contracts/medical-financial-workflow.openapi.yaml
- [X] T054 Run backend typecheck, lint, build, and test commands defined in backend/package.json
- [X] T055 Verify Docker Compose startup, migrations, seed, and health smoke flow using docker-compose.yml and backend/tests/integration/docker-compose-smoke.test.ts
- [X] T056 Audit RBAC, validation, PDF generation from stored data, revision preservation, and no-hard-delete behavior across backend/src/modules/visits, backend/src/modules/prescriptions, backend/src/modules/payments, and backend/src/modules/dashboards

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational and requires an existing
  Visit from US1 or seeded test data.
- **User Story 3 (Phase 5)**: Depends on Foundational and can use Patient data
  from Spec 002; visit-linked payments use US1 or seeded test data.
- **User Story 4 (Phase 6)**: Depends on stored patient, appointment, visit,
  and payment data; best completed after US1 and US3.
- **Polish (Phase 7)**: Depends on all desired stories being complete.

### User Story Completion Order

1. **US1 Doctor Records Medical Visit**: Recommended MVP because visits are the
   base clinical record and prescription dependency.
2. **US2 Doctor Manages Prescriptions and PDFs**: Adds clinical output after
   visits exist.
3. **US3 Staff Register Payments**: Adds financial workflow and balances.
4. **US4 View Operational and Financial Dashboards**: Adds summaries over
   completed administrative, clinical, and payment workflows.

### Parallel Opportunities

- Setup helper tasks T003-T006 can run in parallel.
- Foundational helper tasks T009-T010 can run in parallel after schema shape is
  understood.
- US1 tests T012-T015 can run in parallel; T016 can run while service behavior
  is being implemented.
- US2 tests T022-T025 can run in parallel; T026 and T027 can run in parallel.
- US3 tests T033-T036 can run in parallel; T037 can run while payment service
  behavior is implemented.
- US4 tests T043-T045 can run in parallel; T046 can run while dashboard service
  behavior is implemented.
- Polish documentation tasks T052-T053 can run in parallel.

---

## Parallel Example: User Story 1

```text
Task: T012 Add visit contract tests in backend/tests/contract/medical-visits.test.ts
Task: T013 Add Doctor visit workflow integration test in backend/tests/integration/doctor-visits.test.ts
Task: T014 Add Secretary forbidden clinical write integration test in backend/tests/integration/secretary-clinical-forbidden.test.ts
Task: T015 Add Visit service unit tests in backend/tests/unit/visits.service.test.ts
```

## Parallel Example: User Story 2

```text
Task: T022 Add prescription contract tests in backend/tests/contract/medical-prescriptions.test.ts
Task: T023 Add Doctor prescription and PDF integration test in backend/tests/integration/doctor-prescriptions-pdf.test.ts
Task: T024 Add Prescription service unit tests in backend/tests/unit/prescriptions.service.test.ts
Task: T025 Add Prescription PDF unit tests in backend/tests/unit/prescriptions.pdf.test.ts
```

## Parallel Example: User Story 3

```text
Task: T033 Add payment contract tests in backend/tests/contract/financial-payments.test.ts
Task: T034 Add Secretary payment workflow integration test in backend/tests/integration/secretary-payments.test.ts
Task: T035 Add Payment service unit tests in backend/tests/unit/payments.service.test.ts
Task: T036 Add money helper unit tests in backend/tests/unit/decimal.test.ts
```

## Parallel Example: User Story 4

```text
Task: T043 Add dashboard contract tests in backend/tests/contract/dashboards.test.ts
Task: T044 Add dashboard RBAC integration test in backend/tests/integration/dashboard-rbac.test.ts
Task: T045 Add Dashboard service unit tests in backend/tests/unit/dashboards.service.test.ts
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for US1.
3. Validate Doctor can create/correct visits and Secretary clinical writes are
   denied.
4. Stop and demo the medical visit workflow.

### Incremental Delivery

1. Deliver US1 for medical visit history.
2. Deliver US2 for prescriptions and PDFs.
3. Deliver US3 for payments and balances.
4. Deliver US4 for dashboards and reporting.
5. Run Phase 7 verification before considering the specification complete.

### Quality Gates

- Each story's tests are written before implementation and initially fail.
- Controllers remain thin; services own medical, PDF, financial, and dashboard
  rules.
- Every route uses JWT authentication, RBAC, validation, and sanitization.
- Medical, prescription, and payment corrections append revisions.
- Prescription PDFs are generated from stored structured data.
- `pnpm test`, `pnpm build`, `pnpm lint`, and Docker Compose verification pass
  before final handoff.
