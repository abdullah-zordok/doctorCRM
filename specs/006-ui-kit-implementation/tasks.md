# Tasks: UI Kit Implementation Specification

**Input**: Design documents from `/specs/006-ui-kit-implementation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-kit-contract.md, quickstart.md

**Tests**: The feature specification does not request a TDD workflow. Validation tasks focus on existing typecheck, lint, production build, browser smoke checks, and UI kit design review.

**Organization**: Tasks are grouped by user story so each visual implementation increment can be completed and validated independently while preserving existing clinic workflow behavior.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or independent areas
- **[Story]**: User story traceability label, for example [US1]
- Every task includes an exact file path

---

## Phase 1: Setup (Shared UI Kit Preparation)

**Purpose**: Prepare the frontend visual foundation and validation notes for SPEC 03 before screen-level implementation begins.

- [X] T001 Audit existing shared UI primitives against `Ui_Kit/01-login.png` through `Ui_Kit/09-settings.png` and record reusable pattern gaps in `specs/006-ui-kit-implementation/quickstart.md`
- [X] T002 Define SPEC 03 color, radius, shadow, spacing, and typography token adjustments in `frontend/src/styles/globals.css`
- [X] T003 [P] Extend shared card surface variants for UI kit density and dashboard/profile sections in `frontend/src/components/ui/card.tsx`
- [X] T004 [P] Extend shared button variants for primary, secondary, subtle, and icon-heavy UI kit actions in `frontend/src/components/ui/button.tsx`
- [X] T005 [P] Extend shared badge/status visual affordances for non-color-only status treatment in `frontend/src/components/ui/badge.tsx`
- [X] T006 [P] Extend shared input/search styling for UI kit search bars and form fields in `frontend/src/components/ui/input.tsx` and `frontend/src/components/ui/search-input.tsx`

---

## Phase 2: Foundational (Blocking Shared Layout And Workflow Patterns)

**Purpose**: Update cross-screen layout and repeated workflow patterns that all UI kit screens depend on.

**Critical**: No user story screen work should begin until this phase is complete.

- [X] T007 Refine authenticated shell spacing, content width, and responsive page container behavior in `frontend/src/layout/app-shell.tsx`
- [X] T008 Refine sidebar visual hierarchy, branding area, active states, and mobile treatment in `frontend/src/layout/sidebar.tsx`
- [X] T009 Refine top navigation layout, global search placement, user menu spacing, and mobile sidebar trigger in `frontend/src/layout/top-nav.tsx`
- [X] T010 [P] Refine breadcrumb spacing and page context display in `frontend/src/layout/breadcrumbs.tsx`
- [X] T011 [P] Refine global search result cards and keyboard/focus states in `frontend/src/layout/global-search.tsx`
- [X] T012 [P] Refine table header, row density, hover states, overflow behavior, and empty treatment in `frontend/src/components/ui/data-table.tsx`
- [X] T013 [P] Refine reusable workflow sections for UI kit card grouping and section headers in `frontend/src/features/shared/workflow-section.tsx`
- [X] T014 [P] Refine quick action layout and icon/text treatment in `frontend/src/features/shared/quick-action-bar.tsx`
- [X] T015 [P] Refine status chip variants to include text/icon non-color cues in `frontend/src/features/shared/status-chip.tsx`
- [X] T016 [P] Refine shared loading, empty, and error state presentation in `frontend/src/features/shared/workflow-states.tsx`

**Checkpoint**: Shared SPEC 03 visual foundation is ready; UI kit screens can now be implemented in order.

---

## Phase 3: User Story 1 - Apply UI Kit To Login And Shell (Priority: P1) MVP

**Goal**: Make the login page and persistent application shell match the clinic UI kit baseline while preserving authentication, route guards, and navigation behavior.

**Independent Test**: Open `/login`, sign in, navigate through the authenticated shell, and confirm branding, layout hierarchy, navigation placement, spacing, responsiveness, and active states match the UI kit intent without breaking auth.

### Implementation for User Story 1

- [X] T017 [US1] Implement UI kit login page structure, clinic branding, remembered-user affordance, recovery entry point, and responsive split layout in `frontend/src/features/auth/login-page.tsx`
- [X] T018 [US1] Preserve public-only, protected, role redirect, and loading-shell behavior after login/shell refinements in `frontend/src/features/auth/auth-routes.tsx`
- [X] T019 [US1] Update route-level skeleton presentation to align with the refined shell and login loading states in `frontend/src/routes/router.tsx`
- [X] T020 [US1] Refine navigation item labels, active matching, and role visibility for the updated shell in `frontend/src/layout/navigation.ts`
- [X] T021 [US1] Validate login and shell review notes for `Ui_Kit/01-login.png` in `specs/006-ui-kit-implementation/quickstart.md`

**Checkpoint**: Login and shared shell are visually aligned with the UI kit and independently usable.

---

## Phase 4: User Story 2 - Refine Role Dashboards (Priority: P1)

**Goal**: Make Doctor and Secretary dashboards follow their UI kit references while preserving operational priority and role-specific quick actions.

**Independent Test**: Sign in as Doctor and Secretary, open `/doctor` and `/secretary`, and confirm the corresponding dashboard references are followed while the next clinic/reception action remains prominent.

### Implementation for User Story 2

- [X] T022 [P] [US2] Refine Doctor dashboard widgets for queue, appointments, recent patients, metrics, and quick actions in `frontend/src/features/dashboards/dashboard-widgets.tsx`
- [X] T023 [US2] Implement UI kit Doctor dashboard page hierarchy and responsive layout in `frontend/src/features/dashboards/doctor-dashboard-page.tsx`
- [X] T024 [P] [US2] Refine Secretary dashboard widgets for schedule, queue overview, completed visits, recent patients, and reception actions in `frontend/src/features/dashboards/secretary-dashboard-widgets.tsx`
- [X] T025 [US2] Implement UI kit Secretary dashboard page hierarchy and responsive layout in `frontend/src/features/dashboards/secretary-dashboard-page.tsx`
- [X] T026 [US2] Adjust dashboard view-model labels only where needed to support UI kit sections without changing workflow behavior in `frontend/src/features/dashboards/dashboard.api.ts`
- [X] T027 [US2] Validate dashboard review notes for `Ui_Kit/02-doctor-dashboard.png` and `Ui_Kit/03-secretary-dashboard.png` in `specs/006-ui-kit-implementation/quickstart.md`

**Checkpoint**: Doctor and Secretary dashboards are visually refined and remain independently testable by role.

---

## Phase 5: User Story 3 - Refine Patient And Appointment Workflows (Priority: P2)

**Goal**: Make patient list, patient profile, and appointments follow the UI kit references while preserving search, filters, tables, forms, pagination, quick actions, and status visibility.

**Independent Test**: Open `/patients`, `/patients/:patientId`, and `/appointments`, then confirm each screen matches its UI kit reference while shared patient and appointment workflows still complete.

### Implementation for User Story 3

- [X] T028 [P] [US3] Refine patient table columns, row actions, search/filter area, and pagination density in `frontend/src/features/patients/patient-table.tsx`
- [X] T029 [US3] Implement UI kit patients list layout with search, filter, add-patient action, table, and responsive spacing in `frontend/src/features/patients/patients-list-page.tsx`
- [X] T030 [P] [US3] Refine patient form grouping, validation feedback, and dialog-friendly layout in `frontend/src/features/patients/patient-form.tsx`
- [X] T031 [P] [US3] Refine patient profile tabs, information cards, history sections, payments summary, and responsive tab layout in `frontend/src/features/patients/patient-profile-tabs.tsx`
- [X] T032 [US3] Implement UI kit patient profile header, overview layout, timeline placement, and profile page responsiveness in `frontend/src/features/patients/patient-profile-page.tsx`
- [X] T033 [P] [US3] Refine appointment table columns, status actions, non-color status indicators, and row density in `frontend/src/features/appointments/appointment-table.tsx`
- [X] T034 [P] [US3] Refine appointment form defaults, grouped fields, and validation feedback in `frontend/src/features/appointments/appointment-form.tsx`
- [X] T035 [US3] Implement UI kit appointments page with calendar context, filters, search, summary cards, table, and quick actions in `frontend/src/features/appointments/appointments-page.tsx`
- [X] T036 [US3] Validate patient and appointment review notes for `Ui_Kit/04-patients-list.png`, `Ui_Kit/05-patient-profile.png`, and `Ui_Kit/08-appointments.png` in `specs/006-ui-kit-implementation/quickstart.md`

**Checkpoint**: Patient and appointment workflows are visually refined and remain independently testable.

---

## Phase 6: User Story 4 - Refine Clinical Visit And Prescription Workflows (Priority: P2)

**Goal**: Make the visit workspace and prescription builder follow the UI kit references while preserving one-page consultation work, dynamic medicine editing, and printable prescription behavior.

**Independent Test**: Open `/visits/:visitId` and `/visits/:visitId/prescriptions/new`, complete common clinical inputs, and confirm required context and actions remain visible.

### Implementation for User Story 4

- [X] T037 [P] [US4] Refine patient context panel with UI kit clinical header, patient details, and status treatment in `frontend/src/features/visits/patient-context-panel.tsx`
- [X] T038 [P] [US4] Refine visit form sections for complaint, diagnosis, clinical notes, follow-up notes, validation feedback, and vital-sign-ready layout in `frontend/src/features/visits/visit-form.tsx`
- [X] T039 [US4] Implement UI kit visit workspace layout with patient context, consultation form, timeline, visit information, and quick actions in `frontend/src/features/visits/visit-workspace-page.tsx`
- [X] T040 [P] [US4] Refine shared clinical form shell spacing, labels, section actions, and error presentation in `frontend/src/features/shared/clinical-form-shell.tsx`
- [X] T041 [P] [US4] Refine medicine table search/editing rows, dosage controls, duration controls, and responsive overflow in `frontend/src/features/prescriptions/medicine-table.tsx`
- [X] T042 [P] [US4] Refine prescription print preview summary, medicine grouping, and print-ready visual hierarchy in `frontend/src/features/prescriptions/prescription-print-preview.tsx`
- [X] T043 [US4] Implement UI kit prescription builder layout with medicine search, common templates, instructions, follow-up, summary, and quick actions in `frontend/src/features/prescriptions/prescription-builder-page.tsx`
- [X] T044 [US4] Validate clinical review notes for `Ui_Kit/06-visit-screen.png` and `Ui_Kit/07-prescription-builder.png` in `specs/006-ui-kit-implementation/quickstart.md`

**Checkpoint**: Visit and prescription workflows are visually refined and remain independently testable by a Doctor.

---

## Phase 7: User Story 5 - Refine Settings And Shared UI Consistency (Priority: P3)

**Goal**: Complete the settings screen and final cross-screen consistency pass so the app feels visually complete and future-module ready.

**Independent Test**: Open `/settings` and sample repeated components across all UI kit screens, confirming consistent cards, buttons, inputs, tables, badges, tabs, empty states, loading states, and shell behavior.

### Implementation for User Story 5

- [X] T045 [US5] Create UI kit settings page with profile settings, clinic information, general settings, preferences, toggles, save action, and quick links in `frontend/src/features/settings/settings-page.tsx`
- [X] T046 [US5] Wire `/settings` to the new settings page instead of the placeholder in `frontend/src/routes/router.tsx`
- [X] T047 [P] [US5] Refine generic placeholder/error page presentation for any remaining future routes in `frontend/src/routes/shell-pages.tsx`
- [X] T048 [P] [US5] Refine patient timeline visual rhythm and icon/text status treatment for cross-screen consistency in `frontend/src/features/shared/patient-timeline.tsx`
- [X] T049 [US5] Validate settings and shared consistency review notes for `Ui_Kit/09-settings.png` in `specs/006-ui-kit-implementation/quickstart.md`

**Checkpoint**: Settings and shared visual patterns are complete and consistent with the rest of SPEC 03.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Validate visual fidelity, accessibility, responsiveness, and production readiness across all SPEC 03 screens.

- [X] T050 [P] Verify responsive desktop, tablet, and mobile behavior for SPEC 03 layout rules in `frontend/src/styles/globals.css`
- [X] T051 [P] Verify status indicators, focus states, labels, and non-color-only cues across shared primitives in `frontend/src/components/ui/badge.tsx`, `frontend/src/components/ui/button.tsx`, and `frontend/src/features/shared/status-chip.tsx`
- [ ] T052 Verify all UI kit screen routes and manual scenarios are documented as complete in `specs/006-ui-kit-implementation/quickstart.md`
- [X] T053 Run frontend typecheck from `frontend/package.json`
- [X] T054 Run frontend lint from `frontend/package.json`
- [X] T055 Run frontend production build from `frontend/package.json`
- [ ] T056 Perform browser smoke validation for `/login`, `/doctor`, `/secretary`, `/patients`, `/patients/:patientId`, `/visits/:visitId`, `/visits/:visitId/prescriptions/new`, `/appointments`, and `/settings` using `specs/006-ui-kit-implementation/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user story screen work.
- **User Stories (Phases 3-7)**: Depend on Foundational completion. Execute in UI kit order for best consistency.
- **Polish (Phase 8)**: Depends on all selected user stories being complete.

### User Story Dependencies

- **US1 Apply UI Kit To Login And Shell (P1)**: Starts after Foundation; establishes shared shell baseline.
- **US2 Refine Role Dashboards (P1)**: Starts after US1 because dashboards rely on the refined shell.
- **US3 Refine Patient And Appointment Workflows (P2)**: Starts after US1; benefits from shared table/card/form primitives and can proceed in parallel with US4 after dashboard patterns stabilize.
- **US4 Refine Clinical Visit And Prescription Workflows (P2)**: Starts after US1; can proceed in parallel with US3 after shared clinical/form primitives are stable.
- **US5 Refine Settings And Shared UI Consistency (P3)**: Starts after US1 and should finish after US2-US4 so it can perform consistency cleanup.

### Within Each User Story

- Update shared primitives before page composition when both are needed.
- Preserve route guards, role visibility, workflow actions, validation, loading, empty, and error states while changing layout.
- Complete the story checkpoint before moving to the next UI kit screen group.

---

## Parallel Opportunities

- T003 through T006 can run in parallel after T002 establishes token direction.
- T010 through T016 can run in parallel after shell tasks T007-T009 are understood.
- T022 and T024 can run in parallel during dashboard widget refinement.
- T028, T030, T031, T033, and T034 can run in parallel during patient/appointment component refinement.
- T037, T038, T040, T041, and T042 can run in parallel during clinical workflow component refinement.
- T047 and T048 can run in parallel after T045 starts.
- T050 and T051 can run in parallel during final polish.

## Parallel Example: User Story 3

```bash
Task: "T028 [P] [US3] Refine patient table columns, row actions, search/filter area, and pagination density in frontend/src/features/patients/patient-table.tsx"
Task: "T030 [P] [US3] Refine patient form grouping, validation feedback, and dialog-friendly layout in frontend/src/features/patients/patient-form.tsx"
Task: "T033 [P] [US3] Refine appointment table columns, status actions, non-color status indicators, and row density in frontend/src/features/appointments/appointment-table.tsx"
Task: "T034 [P] [US3] Refine appointment form defaults, grouped fields, and validation feedback in frontend/src/features/appointments/appointment-form.tsx"
```

## Parallel Example: User Story 4

```bash
Task: "T037 [P] [US4] Refine patient context panel with UI kit clinical header, patient details, and status treatment in frontend/src/features/visits/patient-context-panel.tsx"
Task: "T038 [P] [US4] Refine visit form sections for complaint, diagnosis, clinical notes, follow-up notes, validation feedback, and vital-sign-ready layout in frontend/src/features/visits/visit-form.tsx"
Task: "T041 [P] [US4] Refine medicine table search/editing rows, dosage controls, duration controls, and responsive overflow in frontend/src/features/prescriptions/medicine-table.tsx"
Task: "T042 [P] [US4] Refine prescription print preview summary, medicine grouping, and print-ready visual hierarchy in frontend/src/features/prescriptions/prescription-print-preview.tsx"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: Login and Shell.
4. Stop and validate `/login` plus authenticated shell navigation independently.

### Incremental Delivery

1. Deliver login and shell baseline.
2. Add Doctor and Secretary dashboards.
3. Add patient and appointment workflows.
4. Add visit and prescription workflows.
5. Add settings and shared consistency pass.
6. Finish with responsive, accessibility, build, and browser smoke validation.

### Parallel Team Strategy

1. Team completes Setup and Foundation together.
2. After Foundation, one developer owns shell/login, one owns dashboards, one owns patient/appointment components, and one owns clinical/prescription components.
3. Coordinate shared files such as `frontend/src/styles/globals.css`, `frontend/src/routes/router.tsx`, and shared UI primitives to avoid conflicting edits.

---

## Notes

- [P] tasks are safe to work in parallel when dependencies are complete.
- UI kit image files are references only; do not embed them as runtime screen backgrounds.
- Backend behavior is out of scope unless a visual change reveals an existing integration defect.
- Settings is part of SPEC 03 and should replace the current placeholder route.
- Commit after each story or logical phase when using the optional Spec Kit git hook workflow.
