# Implementation Plan: Frontend Foundation & Application Shell

**Branch**: `004-frontend-foundation-shell` | **Date**: 2026-06-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-frontend-foundation-shell/spec.md`

## Summary

Build the reusable frontend foundation for the clinic product: role-based sign-in, protected application shell, responsive sidebar and top navigation, global patient search, notifications, loading/error/empty states, and a shared component system that future clinic workflow screens can reuse without redesigning the shell.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: React 18, Vite, Tailwind CSS, React Router, React Query, React Hook Form, Zod, TanStack Table, Radix UI primitives, Lucide icons

**Storage**: Browser session state for authenticated user data and access token; backend API remains the source of truth for user and patient data

**Testing**: TypeScript typecheck, ESLint, production build, and browser smoke verification of login, shell navigation, search, and responsive behavior

**Target Platform**: Modern desktop and tablet browsers with functional mobile support; local development through Docker Compose and direct Vite dev server

**Project Type**: Web application frontend package paired with the existing backend API service

**Performance Goals**: Login transitions should feel immediate after authentication, protected page switches should remain responsive, and patient search should return visible results or a clear empty state within 1 second for normal clinic-sized datasets

**Constraints**: Must preserve existing backend authentication and patient search contracts; must not implement SPEC 02 clinical workflows or SPEC 03 screen-by-screen UI kit pages; must keep the shell extensible for future modules without redesign

**Scale/Scope**: Single-clinic frontend for Doctor and Secretary roles with a reusable shell, shared component set, and placeholder routes for future modules

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Backend-first scope: PASS - the frontend consumes already-established backend auth and patient endpoints and does not redefine clinical or financial behavior.
- Approved stack: PASS - the feature uses TypeScript and Docker-backed local development, and introduces a dedicated frontend package without changing the backend runtime foundation.
- Modular architecture: PASS - auth, layout, notifications, routing, and UI primitives are separated into focused frontend modules.
- Security and validation: PASS - protected routes, role-aware navigation, and form validation are part of the shell foundation.
- Historical integrity: PASS - this feature does not create or overwrite medical, prescription, or financial records.
- Prescription output: PASS - not applicable to the shell foundation.
- Extensibility: PASS - the shell is explicitly designed to support future multi-module expansion.

## Project Structure

### Documentation (this feature)

```text
specs/004-frontend-foundation-shell/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- frontend-shell.md
`-- tasks.md
```

### Source Code (repository root)

```text
frontend/
|-- index.html
|-- package.json
|-- vite.config.ts
|-- tailwind.config.ts
|-- tsconfig.json
|-- src/
|   |-- components/
|   |   `-- ui/
|   |-- features/
|   |   |-- auth/
|   |   `-- notifications/
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

**Structure Decision**: Keep the frontend as a dedicated `frontend/` package alongside the existing backend service. The shell, auth flow, notifications, layout, and reusable UI components live under `frontend/src`, while the backend remains unchanged and continues to provide the API contracts the shell depends on.

## Complexity Tracking

No constitution violations.

## Phase 0: Research

Research decisions are captured in [research.md](./research.md). No unresolved clarifications remain.

## Phase 1: Design

Design artifacts are captured in:

- [data-model.md](./data-model.md)
- [contracts/frontend-shell.md](./contracts/frontend-shell.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Backend-first scope: PASS - the shell builds on existing backend contracts instead of redefining them.
- Approved stack: PASS - the frontend package is added without altering backend runtime choices.
- Modular architecture: PASS - layout, auth, notification, and UI primitives remain isolated.
- Security and validation: PASS - protected shell access and validation behavior are preserved.
- Historical integrity: PASS - no clinical or financial record behavior is changed.
- Prescription output: PASS - not applicable.
- Extensibility: PASS - the shell and routes leave room for future clinic modules.
