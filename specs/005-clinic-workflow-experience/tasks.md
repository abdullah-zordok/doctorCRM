# Tasks: Clinic Workflow Experience

**Input**: Design documents from `/specs/005-clinic-workflow-experience/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/clinic-workflow.md, quickstart.md

**Tests**: Include focused frontend tests for critical medical workflow behavior, role visibility, form validation, queue ordering, and route integration. Broader visual regression and backend contract testing remain outside this frontend-only specification.

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently after the shared workflow foundation is complete.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or independent areas
- **[Story]**: User story traceability label, for example [US1]
- Every task includes an exact file path

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the SPEC 02 frontend module structure on top of the completed SPEC 01 application shell.

- [X] T001 Create workflow feature folders in `frontend/src/features/dashboards/`, `frontend/src/features/patients/`, `frontend/src/features/visits/`, `frontend/src/features/prescriptions/`, and `frontend/src/features/appointments/`
- [X] T002 [P] Define shared clinic workflow domain types in `frontend/src/types/workflow.ts`
- [X] T003 [P] Add workflow route path constants in `frontend/src/routes/workflow-routes.ts`
- [X] T004 [P] Add reusable workflow status and priority constants in `frontend/src/features/shared/workflow-status.ts`
- [X] T005 Update SPEC 02 route imports and lazy page placeholders in `frontend/src/routes/router.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared frontend primitives, mock API boundaries, and navigation wiring required by every clinic workflow story.

**Critical**: No user story implementation should begin until this phase is complete.

- [X] T006 Create shared workflow API adapters and mock data seams in `frontend/src/features/shared/workflow-api.ts`
- [X] T007 [P] Create shared quick action component in `frontend/src/features/shared/quick-action-bar.tsx`
- [X] T008 [P] Create shared status chip component in `frontend/src/features/shared/status-chip.tsx`
- [X] T009 [P] Create shared page section component in `frontend/src/features/shared/workflow-section.tsx`
- [X] T010 [P] Create shared clinical form shell component in `frontend/src/features/shared/clinical-form-shell.tsx`
- [X] T011 [P] Create shared timeline component in `frontend/src/features/shared/patient-timeline.tsx`
- [X] T012 Extend global search indexing for patients, appointments, visits, and prescriptions in `frontend/src/layout/global-search.tsx`
- [X] T013 Update sidebar navigation labels, role visibility, and active route matching for workflow routes in `frontend/src/layout/navigation.ts`
- [X] T014 Add reusable workflow loading, empty, and error state helpers in `frontend/src/features/shared/workflow-states.tsx`
- [X] T015 Add foundational route smoke tests for SPEC 02 protected routes in `frontend/src/routes/router.test.tsx`

**Checkpoint**: Shared workflow foundation is ready; user story implementation can now begin.

---

## Phase 3: User Story 1 - Doctor Dashboard (Priority: P1) MVP

**Goal**: Give doctors a clinically prioritized dashboard showing waiting patients, today's visits, the current queue, recent patients, upcoming appointments, and secondary analytics.

**Independent Test**: Sign in as a doctor, open `/doctor`, and confirm waiting patients and current queue are prioritized above analytics while quick actions navigate to visit, patient, appointment, and prescription workflows.

### Tests for User Story 1

- [X] T016 [P] [US1] Add doctor dashboard priority and quick action tests in `frontend/src/features/dashboards/doctor-dashboard-page.test.tsx`

### Implementation for User Story 1

- [X] T017 [P] [US1] Implement doctor dashboard query hook and normalized view model in `frontend/src/features/dashboards/dashboard.api.ts`
- [X] T018 [P] [US1] Implement queue, visit, appointment, and metric dashboard cards in `frontend/src/features/dashboards/dashboard-widgets.tsx`
- [X] T019 [US1] Implement doctor dashboard page layout in `frontend/src/features/dashboards/doctor-dashboard-page.tsx`
- [X] T020 [US1] Wire `/doctor` to `DoctorDashboardPage` in `frontend/src/routes/router.tsx`
- [X] T021 [US1] Add doctor dashboard skeleton, empty, and error states in `frontend/src/features/dashboards/doctor-dashboard-page.tsx`

**Checkpoint**: Doctor dashboard is fully functional and testable independently.

---

## Phase 4: User Story 2 - Secretary Dashboard (Priority: P1)

**Goal**: Give secretaries an operational dashboard focused on today's appointments, waiting patients, new patients, completed visits, quick registration, quick booking, and patient search.

**Independent Test**: Sign in as a secretary, open `/secretary`, and confirm operational lists and quick actions are visible without doctor-only prescription or clinical visit controls.

### Tests for User Story 2

- [X] T022 [P] [US2] Add secretary dashboard role visibility and quick action tests in `frontend/src/features/dashboards/secretary-dashboard-page.test.tsx`

### Implementation for User Story 2

- [X] T023 [P] [US2] Extend dashboard API view models for secretary metrics and work queues in `frontend/src/features/dashboards/dashboard.api.ts`
- [X] T024 [P] [US2] Implement secretary appointment, waiting, and completed visit widgets in `frontend/src/features/dashboards/secretary-dashboard-widgets.tsx`
- [X] T025 [US2] Implement secretary dashboard page layout in `frontend/src/features/dashboards/secretary-dashboard-page.tsx`
- [X] T026 [US2] Wire `/secretary` to `SecretaryDashboardPage` in `frontend/src/routes/router.tsx`
- [X] T027 [US2] Add secretary dashboard skeleton, empty, and error states in `frontend/src/features/dashboards/secretary-dashboard-page.tsx`

**Checkpoint**: Secretary dashboard is fully functional and testable independently.

---

## Phase 5: User Story 3 - Patient Management Workspace (Priority: P1)

**Goal**: Let doctors and secretaries search, filter, open, edit, and review patient records with profile sections for basic info, medical history, visits, prescriptions, appointments, and payments summary placeholders.

**Independent Test**: Open `/patients`, search by name, phone, and patient code, open a patient profile, edit allowed patient details, and confirm profile sections and timeline remain accessible.

### Tests for User Story 3

- [X] T028 [P] [US3] Add patient search, profile navigation, and edit validation tests in `frontend/src/features/patients/patients-workspace.test.tsx`

### Implementation for User Story 3

- [X] T029 [P] [US3] Implement patient query hooks and view models in `frontend/src/features/patients/patients.api.ts`
- [X] T030 [P] [US3] Implement patient table with search, sort, pagination, and quick actions in `frontend/src/features/patients/patient-table.tsx`
- [X] T031 [P] [US3] Implement patient form with grouped fields and instant validation in `frontend/src/features/patients/patient-form.tsx`
- [X] T032 [P] [US3] Implement patient profile tabs for info, medical history, visits, prescriptions, appointments, and payments summary in `frontend/src/features/patients/patient-profile-tabs.tsx`
- [X] T033 [US3] Implement patient list workspace page in `frontend/src/features/patients/patients-list-page.tsx`
- [X] T034 [US3] Implement patient profile workspace page in `frontend/src/features/patients/patient-profile-page.tsx`
- [X] T035 [US3] Wire `/patients` and `/patients/:patientId` to patient workspace pages in `frontend/src/routes/router.tsx`
- [X] T036 [US3] Add patient workspace skeleton, empty, and error states in `frontend/src/features/patients/patients-list-page.tsx` and `frontend/src/features/patients/patient-profile-page.tsx`

**Checkpoint**: Patient management workspace is fully functional and testable independently.

---

## Phase 6: User Story 4 - Visit Consultation Workspace (Priority: P2)

**Goal**: Give doctors a single-page consultation workspace with patient context, chief complaint, diagnosis, clinical notes, follow-up notes, visit info, and finish visit action.

**Independent Test**: Open `/visits/:visitId` as a doctor, review patient context, complete required consultation fields, finish the visit, and confirm validation prevents incomplete clinical records.

### Tests for User Story 4

- [X] T037 [P] [US4] Add visit form validation and finish visit tests in `frontend/src/features/visits/visit-workspace-page.test.tsx`

### Implementation for User Story 4

- [X] T038 [P] [US4] Implement visit query hooks and finish visit mutation boundary in `frontend/src/features/visits/visits.api.ts`
- [X] T039 [P] [US4] Implement patient context header for consultation pages in `frontend/src/features/visits/patient-context-panel.tsx`
- [X] T040 [P] [US4] Implement clinical notes and diagnosis form sections in `frontend/src/features/visits/visit-form.tsx`
- [X] T041 [US4] Implement visit consultation workspace page in `frontend/src/features/visits/visit-workspace-page.tsx`
- [X] T042 [US4] Wire `/visits/:visitId` as a doctor-only route in `frontend/src/routes/router.tsx`
- [X] T043 [US4] Add visit workspace skeleton, empty, and error states in `frontend/src/features/visits/visit-workspace-page.tsx`

**Checkpoint**: Visit consultation workspace is fully functional and testable independently.

---

## Phase 7: User Story 5 - Prescription Builder (Priority: P2)

**Goal**: Let doctors create prescriptions with multiple medicines, dosage, duration, notes, summary, and printable or PDF-ready output.

**Independent Test**: Open `/visits/:visitId/prescriptions/new` as a doctor, add multiple medicines, validate required dosage and duration fields, review the summary, and open print output.

### Tests for User Story 5

- [X] T044 [P] [US5] Add prescription medicine list, validation, and print output tests in `frontend/src/features/prescriptions/prescription-builder-page.test.tsx`

### Implementation for User Story 5

- [X] T045 [P] [US5] Implement prescription query and create mutation boundaries in `frontend/src/features/prescriptions/prescriptions.api.ts`
- [X] T046 [P] [US5] Implement dynamic medicine rows with dosage, duration, and notes in `frontend/src/features/prescriptions/medicine-table.tsx`
- [X] T047 [P] [US5] Implement prescription summary and print-ready layout in `frontend/src/features/prescriptions/prescription-print-preview.tsx`
- [X] T048 [US5] Implement prescription builder page in `frontend/src/features/prescriptions/prescription-builder-page.tsx`
- [X] T049 [US5] Wire `/visits/:visitId/prescriptions/new` as a doctor-only route in `frontend/src/routes/router.tsx`

**Checkpoint**: Prescription builder is fully functional and testable independently.

---

## Phase 8: User Story 6 - Appointment Management (Priority: P2)

**Goal**: Give doctors and secretaries a clear appointment workspace where today's schedule is primary, waiting patients are visually prioritized, completed appointments sit lower, and cancelled appointments remain visible but distinct.

**Independent Test**: Open `/appointments`, confirm today's appointments are shown by default, waiting items appear before completed items, cancelled items remain visible with a distinct non-color-only treatment, and booking actions are available to secretaries.

### Tests for User Story 6

- [X] T050 [P] [US6] Add appointment ordering, status display, and booking visibility tests in `frontend/src/features/appointments/appointments-page.test.tsx`

### Implementation for User Story 6

- [X] T051 [P] [US6] Implement appointment query hooks and status ordering in `frontend/src/features/appointments/appointments.api.ts`
- [X] T052 [P] [US6] Implement appointment table with search, sort, pagination, and status actions in `frontend/src/features/appointments/appointment-table.tsx`
- [X] T053 [P] [US6] Implement appointment booking form with smart defaults and validation in `frontend/src/features/appointments/appointment-form.tsx`
- [X] T054 [US6] Implement appointment management page in `frontend/src/features/appointments/appointments-page.tsx`
- [X] T055 [US6] Wire `/appointments` to appointment management page in `frontend/src/routes/router.tsx`
- [X] T056 [US6] Add appointment workspace skeleton, empty, and error states in `frontend/src/features/appointments/appointments-page.tsx`

**Checkpoint**: Appointment management is fully functional and testable independently.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Validate consistency, accessibility, responsiveness, and production readiness across the completed SPEC 02 frontend.

- [X] T057 [P] Verify responsive workflow layouts at mobile, tablet, and desktop widths in `frontend/src/styles/globals.css`
- [X] T058 [P] Verify accessible labels, keyboard focus, click targets, and non-color-only status indicators across `frontend/src/features/`
- [X] T059 [P] Update workflow quickstart validation notes in `specs/005-clinic-workflow-experience/quickstart.md`
- [ ] T060 Run typecheck, lint, unit tests, and production build from `frontend/package.json`
- [ ] T061 Perform browser smoke validation for `/doctor`, `/secretary`, `/patients`, `/patients/:patientId`, `/visits/:visitId`, `/visits/:visitId/prescriptions/new`, and `/appointments` using `specs/005-clinic-workflow-experience/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Stories (Phases 3-8)**: Depend on Foundational completion. P1 stories should be implemented before P2 stories for MVP delivery.
- **Polish (Phase 9)**: Depends on all selected user stories being complete.

### User Story Dependencies

- **US1 Doctor Dashboard (P1)**: Starts after Foundation; no dependency on other stories.
- **US2 Secretary Dashboard (P1)**: Starts after Foundation; no dependency on other stories.
- **US3 Patient Management Workspace (P1)**: Starts after Foundation; no dependency on other stories, but later stories can deep-link into patient profiles.
- **US4 Visit Consultation Workspace (P2)**: Starts after Foundation; benefits from US3 patient components but must remain testable with mocked patient context.
- **US5 Prescription Builder (P2)**: Starts after Foundation; integrates with US4 route context but must remain testable with mocked visit data.
- **US6 Appointment Management (P2)**: Starts after Foundation; can run independently of US4 and US5.

### Within Each User Story

- Write the listed focused test first and confirm it fails before implementing the story.
- Build query hooks and view models before page composition.
- Build reusable section/table/form components before wiring route pages.
- Add loading, empty, and error states before marking the story complete.
- Validate each story independently at its checkpoint before moving to the next priority group.

---

## Parallel Opportunities

- T002, T003, and T004 can run in parallel during Setup.
- T007 through T011 can run in parallel once T006 establishes shared workflow data contracts.
- US1, US2, and US3 can be implemented in parallel after Foundation because they target separate page modules.
- US4, US5, and US6 can be implemented in parallel after Foundation if route integration conflicts in `frontend/src/routes/router.tsx` are coordinated.
- Tests for different user stories can be written in parallel because they live in separate feature folders.

## Parallel Example: P1 Stories

```bash
Task: "T016 [P] [US1] Add doctor dashboard priority and quick action tests in frontend/src/features/dashboards/doctor-dashboard-page.test.tsx"
Task: "T022 [P] [US2] Add secretary dashboard role visibility and quick action tests in frontend/src/features/dashboards/secretary-dashboard-page.test.tsx"
Task: "T028 [P] [US3] Add patient search, profile navigation, and edit validation tests in frontend/src/features/patients/patients-workspace.test.tsx"
```

## Parallel Example: Shared Components

```bash
Task: "T007 [P] Create shared quick action component in frontend/src/features/shared/quick-action-bar.tsx"
Task: "T008 [P] Create shared status chip component in frontend/src/features/shared/status-chip.tsx"
Task: "T009 [P] Create shared page section component in frontend/src/features/shared/workflow-section.tsx"
Task: "T010 [P] Create shared clinical form shell component in frontend/src/features/shared/clinical-form-shell.tsx"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: Doctor Dashboard.
4. Complete Phase 4: Secretary Dashboard.
5. Complete Phase 5: Patient Management Workspace.
6. Stop and validate the P1 workflow across doctor and secretary roles.

### Incremental Delivery

1. Deliver P1 dashboards and patient workspace first.
2. Add visit consultation workspace.
3. Add prescription builder.
4. Add appointment management.
5. Finish with cross-cutting accessibility, responsive, build, and browser smoke validation.

### Parallel Team Strategy

1. Team completes Setup and Foundation together.
2. After Foundation, assign P1 stories by module: dashboards for one developer, patients for another.
3. Assign P2 stories by module: visits, prescriptions, and appointments.
4. Coordinate route edits in `frontend/src/routes/router.tsx` to avoid merge conflicts.

---

## Notes

- [P] tasks are safe to work in parallel when their dependencies are complete.
- Route wiring tasks share `frontend/src/routes/router.tsx`; sequence them or coordinate carefully.
- Keep SPEC 03 financial implementation out of scope. Payment references in this feature are profile summary placeholders only.
- All workflow pages must reuse SPEC 01 shell, navigation, global search, notifications, and shared UI components.
- Commit after each story or logical phase when using the optional Spec Kit git hook workflow.
