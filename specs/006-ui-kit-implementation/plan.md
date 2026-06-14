# Implementation Plan: UI Kit Implementation Specification

**Branch**: `006-ui-kit-implementation` | **Date**: 2026-06-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-ui-kit-implementation/spec.md`

## Summary

Apply the SPEC 03 UI kit reference screens to the existing clinic frontend without changing backend behavior or expanding clinic workflow scope. The implementation will visually refine the login page, shared shell, Doctor dashboard, Secretary dashboard, patients list, patient profile, visit workspace, prescription builder, appointments, and settings in the required UI kit order. The work should preserve existing authentication, role routing, search, forms, table behavior, loading/empty/error states, historical visibility, and prescription output expectations while consolidating repeated visual patterns into shared UI and workflow primitives.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 LTS

**Primary Dependencies**: React 18, Vite, Tailwind CSS, React Router, React Query, React Hook Form, Zod, TanStack Table, Radix UI primitives, Lucide icons, existing frontend API client, existing shared UI components, and existing workflow feature modules

**Storage**: No new storage planned. Existing auth token storage, React Query cache, in-memory SPEC 02 workflow adapter, and backend-backed auth behavior remain unchanged unless already required by existing screens.

**Testing**: Frontend typecheck, lint, production build, existing focused `.test.tsx` scenario files, and browser smoke/design review against `Ui_Kit/` reference images

**Target Platform**: Modern desktop browsers as primary target, tablet as supported secondary target, mobile functional but not workflow-optimized

**Project Type**: Frontend web application visual implementation layered on the existing full-stack clinic app

**Performance Goals**: Refined screens should keep primary content visible within 2 seconds after authenticated navigation in normal local/runtime conditions; routine clinic tasks should remain no slower than SPEC 02 acceptance expectations

**Constraints**: Implement screens in UI kit order; do not copy reference images as static backgrounds; preserve role boundaries, route behavior, forms, workflow actions, loading/empty/error states, and existing backend contracts; avoid one-off duplicated interface patterns where shared primitives fit

**Scale/Scope**: Nine UI kit screens: login, Doctor dashboard, Secretary dashboard, patients list, patient profile, visit workspace, prescription builder, appointments, and settings; visual consistency across existing shared shell and reusable UI patterns

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Backend-first scope: PASS WITH BOUNDED EXCEPTION - SPEC 03 is explicitly a frontend visual refinement over already planned backend/API behavior. No new backend data, API, auth, or operational behavior is introduced.
- Approved stack: PASS - existing TypeScript/Vite frontend remains inside the Docker Compose full-stack project; backend stack is unchanged.
- Modular architecture: PASS - implementation will stay within existing frontend feature modules and shared UI/layout primitives; no backend module changes are planned.
- Security and validation: PASS - existing protected routes, Doctor/Secretary RBAC behavior, and form validation feedback must remain intact.
- Historical integrity: PASS - visit, prescription, appointment, and payment history visible in current workflows must not be hidden by the visual redesign.
- Prescription output: PASS - prescription print/PDF behavior remains based on saved prescription details; UI changes must not alter output semantics.
- Extensibility: PASS - visual patterns should strengthen shared shell/component reuse for future modules.

## Project Structure

### Documentation (this feature)

```text
specs/006-ui-kit-implementation/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- ui-kit-contract.md
|-- checklists/
|   `-- requirements.md
`-- tasks.md
```

### Source Code (repository root)

```text
frontend/
|-- src/
|   |-- components/
|   |   `-- ui/
|   |-- features/
|   |   |-- auth/
|   |   |-- dashboards/
|   |   |-- patients/
|   |   |-- visits/
|   |   |-- prescriptions/
|   |   |-- appointments/
|   |   `-- shared/
|   |-- layout/
|   |-- lib/
|   |-- routes/
|   |-- styles/
|   `-- types/
Ui_Kit/
|-- 01-login.png
|-- 02-doctor-dashboard.png
|-- 03-secretary-dashboard.png
|-- 04-patients-list.png
|-- 05-patient-profile.png
|-- 06-visit-screen.png
|-- 07-prescription-builder.png
|-- 08-appointments.png
`-- 09-settings.png
backend/
|-- src/
|-- prisma/
`-- tests/
docker-compose.yml
```

**Structure Decision**: Implement SPEC 03 inside the existing `frontend/` package. Reuse and refine `components/ui`, `layout`, and `features/shared` before adjusting individual feature pages in the UI kit order. Backend files remain unchanged unless a later task discovers an existing contract break, which must be treated as separate scope.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Frontend-first feature under backend-first constitution | SPEC 03 is explicitly a UI kit implementation specification over an existing backend and frontend foundation | Requiring new backend changes would add scope unrelated to the visual implementation and risk breaking existing clinic contracts |

## Phase 0: Research

Research decisions are captured in [research.md](./research.md). No unresolved clarifications remain.

## Phase 1: Design

Design artifacts are captured in:

- [data-model.md](./data-model.md)
- [contracts/ui-kit-contract.md](./contracts/ui-kit-contract.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Backend-first scope: PASS WITH BOUNDED EXCEPTION - design artifacts explicitly keep backend behavior unchanged and preserve existing contracts.
- Approved stack: PASS - plan uses the established frontend stack and Docker Compose runtime.
- Modular architecture: PASS - design maps UI kit screens to existing frontend modules and shared primitives.
- Security and validation: PASS - role access, route guards, and form validation are required acceptance criteria.
- Historical integrity: PASS - visual states and workflow contracts require completed, cancelled, corrected, and historical facts to remain visible.
- Prescription output: PASS - prescription preview/print behavior remains tied to saved prescription data.
- Extensibility: PASS - shared interface patterns are first-class design entities for future modules.
