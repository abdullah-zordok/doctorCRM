# Quickstart: Clinic Workflow Experience

## Prerequisites

- SPEC 01 frontend foundation is present.
- Backend API is available at `http://localhost:4000/api`.
- Frontend dependencies are installed in `frontend/`.

## Local Setup

```bash
cd frontend
pnpm install
pnpm dev
```

Open:

```text
http://localhost:5173
```

## Full Stack Runtime

```bash
docker compose up --build
```

## Verification Commands

```bash
cd frontend
pnpm typecheck
pnpm lint
pnpm build
```

## Implemented Validation Notes

- SPEC 02 workflow routes are implemented in the frontend shell: `/doctor`, `/secretary`, `/patients`, `/patients/:patientId`, `/visits/:visitId`, `/visits/:visitId/prescriptions/new`, and `/appointments`.
- The frontend package does not currently define a unit test runner script. Focused scenario files are present under `frontend/src/**/*.test.tsx` and are typechecked with the application.
- Vite dev server startup may fail in restricted tool sandboxes with `spawn EPERM` from esbuild. In that case, validate the production build with `pnpm build` and serve `frontend/dist` with an SPA fallback for route smoke checks.

## Manual Verification Scenarios

1. Sign in as a Doctor and confirm `/doctor` prioritizes waiting patients, today's visits, current queue, recent patients, and upcoming appointments.
2. Sign in as a Secretary and confirm `/secretary` prioritizes today's appointments, waiting patients, quick registration, quick booking, and patient search.
3. Open `/patients`, search by name, phone, and patient code, then open a patient profile.
4. Confirm patient profile sections are available without long unstructured scrolling.
5. Open a visit workspace and confirm the doctor can enter complaint, diagnosis, notes, follow-up notes, and finish the visit from one page.
6. Open the prescription builder and confirm multiple medicine rows, dosage, duration, notes, summary, and printable output action are available.
7. Open appointments and confirm waiting, completed, and cancelled states remain visible with clear priority.
8. Confirm loading, empty, and error states are visible and do not blank the shell.
