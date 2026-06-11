# Implementation Plan: Clinic Workflow Experience

**Branch**: `005-clinic-workflow-experience` | **Date**: 2026-06-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-clinic-workflow-experience/spec.md`

## Summary

Build the SPEC 02 clinic workflow experience on top of the SPEC 01 frontend foundation. The feature will replace placeholder workflow routes with operational Doctor and Secretary dashboards, patient management, patient profile, visit consultation, prescription builder, and appointment management screens. The implementation will prioritize daily clinic work over analytics, keep quick actions visible, reuse the established shell and shared UI primitives, and consume existing backend data for patients, appointments, visits, prescriptions, payments, and dashboards.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 LTS

**Primary Dependencies**: React 18, Vite, Tailwind CSS, React Router, React Query, React Hook Form, Zod, TanStack Table, Radix UI primitives, Lucide icons, existing frontend API client and shared UI components

**Storage**: Frontend state via React Query cache and form state; persisted medical, appointment, prescription, payment, and patient data remain in the backend PostgreSQL database via existing API contracts

**Testing**: Frontend typecheck, lint, production build, and browser smoke verification for dashboard, patient, visit, prescription, appointment, loading, empty, and error workflows

**Target Platform**: Modern desktop browsers as primary target, tablet as secondary target, mobile functional but not workflow-optimized

**Project Type**: Frontend web application feature integrated with the existing backend API service

**Performance Goals**: Patient search results or empty state visible within 1 second for normal clinic-sized datasets; primary dashboard content visible within 2 seconds after authenticated navigation; routine prescription generation flow completable in under 1 minute for common prescriptions

**Constraints**: Reuse SPEC 01 authentication, layout, navigation, notifications, and shared UI primitives; do not implement SPEC 03 pixel-guided UI kit screens; do not redesign the shell; preserve backend role boundaries and historical clinical/financial integrity

**Scale/Scope**: Single-doctor clinic with one or more secretaries, daily operational dashboards, patient list/profile, visit workspace, prescription builder, and appointment management; future modules must remain possible without shell redesign

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Backend-first scope: PASS - this frontend plan consumes already-defined backend domains for patients, appointments, visits, prescriptions, payments, dashboards, auth, and RBAC.
- Approved stack: PASS - TypeScript remains the implementation language and Docker Compose remains the local full-stack runtime; backend stack is unchanged.
- Modular architecture: PASS - workflow screens will be organized by frontend feature modules and will call backend services through a shared API client.
- Security and validation: PASS - protected routes, role-aware workflow access, validated forms, and consistent error handling are required.
- Historical integrity: PASS - visit, prescription, appointment, and payment workflows surface existing history and must not hide or destructively overwrite clinical or financial facts.
- Prescription output: PASS - prescription builder must generate printable output from saved prescription details.
- Extensibility: PASS - screens reuse the SPEC 01 shell and shared UI system so future modules can be added without redesign.

## Project Structure

### Documentation (this feature)

```text
specs/005-clinic-workflow-experience/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- clinic-workflow.md
`-- tasks.md
```

### Source Code (repository root)

```text
frontend/
|-- src/
|   |-- components/
|   |   `-- ui/
|   |-- features/
|   |   |-- appointments/
|   |   |-- dashboards/
|   |   |-- patients/
|   |   |-- prescriptions/
|   |   `-- visits/
|   |-- layout/
|   |-- lib/
|   |-- routes/
|   |-- styles/
|   `-- types/
backend/
|-- src/
|-- prisma/
`-- tests/
docker-compose.yml
```

**Structure Decision**: Implement SPEC 02 inside the existing `frontend/` package created by SPEC 01. Add one frontend feature folder per workflow domain and keep cross-cutting layout, shared UI primitives, API transport, route guards, and notifications in their existing shared locations.

## Complexity Tracking

No constitution violations.

## Phase 0: Research

Research decisions are captured in [research.md](./research.md). No unresolved clarifications remain.

## Phase 1: Design

Design artifacts are captured in:

- [data-model.md](./data-model.md)
- [contracts/clinic-workflow.md](./contracts/clinic-workflow.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Backend-first scope: PASS - the workflow UI maps to existing backend resources and does not invent independent clinical state.
- Approved stack: PASS - frontend implementation stays in the established TypeScript/Vite package and Docker Compose remains the full runtime.
- Modular architecture: PASS - dashboards, patients, visits, prescriptions, and appointments are planned as separate frontend feature modules.
- Security and validation: PASS - role access and form validation are documented in the UI contract and data model.
- Historical integrity: PASS - timeline, visit, prescription, appointment, and payment displays preserve prior facts and status visibility.
- Prescription output: PASS - printable prescriptions are generated from saved prescription details.
- Extensibility: PASS - the shell remains reusable for future modules.
