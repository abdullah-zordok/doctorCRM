# Quickstart: UI Kit Implementation Specification

## Prerequisites

- SPEC 01 frontend foundation is present.
- SPEC 02 workflow screens are present.
- UI references exist in `Ui_Kit/`.
- Backend API is available at `http://localhost:4000/api` for authenticated local usage.
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

Run backend migrations and seed if the database is empty:

```bash
docker compose exec backend pnpm prisma migrate dev
docker compose exec backend pnpm prisma db seed
```

## Verification Commands

```bash
cd frontend
pnpm typecheck
pnpm lint
pnpm build
```

The frontend package currently does not define a dedicated unit test script. Existing `.test.tsx` files should still remain type-safe, and a later tasks phase may add an explicit test runner if required.

## UI Kit Review Order

Validate screens in this order:

1. `Ui_Kit/01-login.png` -> `/login`
2. `Ui_Kit/02-doctor-dashboard.png` -> `/doctor`
3. `Ui_Kit/03-secretary-dashboard.png` -> `/secretary`
4. `Ui_Kit/04-patients-list.png` -> `/patients`
5. `Ui_Kit/05-patient-profile.png` -> `/patients/:patientId`
6. `Ui_Kit/06-visit-screen.png` -> `/visits/:visitId`
7. `Ui_Kit/07-prescription-builder.png` -> `/visits/:visitId/prescriptions/new`
8. `Ui_Kit/08-appointments.png` -> `/appointments`
9. `Ui_Kit/09-settings.png` -> `/settings`

## Shared Pattern Audit

- Reusable foundation retained: buttons, cards, inputs, search inputs, badges, dialogs, dropdowns, tabs, tables, pagination, skeletons, empty states, error states, tooltips, workflow sections, status chips, quick actions, and patient timeline.
- Shared refinements required and implemented first: healthcare color tokens, larger radii, softer surfaces, denser table hierarchy, clearer active navigation, non-color status icons, improved focus states, and responsive page spacing.
- Screen-specific gaps: UI kit login composition, dashboard hierarchy, patient profile header/cards, appointment calendar context, clinical workspace framing, prescription template/summary layout, and a real settings page.

## Implementation Review Notes

- Login and shell: clinic branding, split login composition, remembered-user and recovery affordances, responsive navigation, active route states, global search placement, and role redirects are represented without changing authentication behavior.
- Role dashboards: Doctor and Secretary pages use consistent metric cards, prioritized queue/schedule areas, compact secondary context, and role-specific quick actions while keeping operational tasks above analytics.
- Patient and appointments: patient search/filter/table, grouped registration/edit forms, profile header and tabbed history cards, appointment summary metrics, state filters, and prioritized schedule rows follow one consistent visual system.
- Clinical workflows: visit context, clinical notes, non-persisted vital-sign placeholders, sticky patient context, medicine search/add, common prescription templates, editable medicine rows, and sticky print preview are represented without changing backend contracts.
- Settings and consistency: `/settings` now provides profile, clinic, protected-access context, workspace preferences, toggle controls, save feedback, and shared card/tab/timeline styling.

## Manual Validation Scenarios

1. Open `/login` and confirm branding, form hierarchy, remembered-user affordance, recovery entry point, and responsive behavior match the UI kit intent.
2. Sign in as a Doctor and confirm `/doctor` visually follows the dashboard reference while making the next clinical action obvious.
3. Sign in as a Secretary and confirm `/secretary` visually follows the dashboard reference while keeping registration and booking actions easy to find.
4. Open `/patients`, search by name/phone/code, and confirm table layout, filters, actions, empty/loading/error states, and pagination remain usable.
5. Open `/patients/:patientId` and confirm the profile header, information cards, tabs, timeline, and historical sections follow the reference without long unstructured scrolling.
6. Open `/visits/:visitId` and confirm patient context, consultation form, notes, timeline, visit information, and quick actions remain visible and usable.
7. Open `/visits/:visitId/prescriptions/new` and confirm editable medicines, dosage, duration, instructions, summary, templates, and print action remain available.
8. Open `/appointments` and confirm calendar context, filters, search, statuses, appointment summary, table, and quick actions follow the reference.
9. Open `/settings` and confirm profile, clinic information, preferences, toggles, save action, and quick links are represented.
10. Confirm all status indicators have non-color cues, all major screens retain shell navigation, and protected route behavior still works.

## Validation Status

- Responsive and accessibility review: PASS. Shared layouts use mobile-first stacking and `sm`/`md`/`xl` breakpoints; focus-visible rings, labels, and icon-plus-text status cues are present.
- Frontend typecheck: PASS using the local TypeScript binary equivalent to `pnpm typecheck`.
- Frontend lint: PASS using the local ESLint binary equivalent to `pnpm lint`.
- Frontend production build: PASS using the package build commands (`tsc --noEmit` and `vite build`).
- Build note: Vite reports a non-blocking warning for a 542.08 kB main chunk after minification.
- Browser smoke validation: BLOCKED on 2026-06-14. The local frontend responds at `http://127.0.0.1:5173`, but the in-app Browser surface is unavailable and Docker Desktop is not running, so authenticated route scenarios could not be completed.
