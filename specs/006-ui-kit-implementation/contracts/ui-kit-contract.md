# UI Kit Implementation Contract

## Purpose

Define the screen, role, visual-state, and acceptance contracts for applying the SPEC 03 UI kit references to the existing clinic frontend.

## Global Contract

- All screens must preserve the existing application shell unless the UI kit refinement updates the shell consistently across every authenticated route.
- Visual fidelity means matching layout hierarchy, spacing, grouping, component priority, and user flow; it does not mean embedding screenshots or copying static image layers.
- Existing workflow behavior remains authoritative when a screenshot and an implemented clinic requirement conflict.
- Repeated patterns must be shared where practical so future modules can use the same visual language.

## Screen Contract

- `/login` must match `Ui_Kit/01-login.png` for clinic branding, login form hierarchy, remembered-user affordance, recovery entry point, and responsive behavior.
- `/doctor` must match `Ui_Kit/02-doctor-dashboard.png` while preserving waiting-patient and queue priority.
- `/secretary` must match `Ui_Kit/03-secretary-dashboard.png` while preserving reception quick actions and today's schedule priority.
- `/patients` must match `Ui_Kit/04-patients-list.png` while preserving search, filters, table actions, and pagination.
- `/patients/:patientId` must match `Ui_Kit/05-patient-profile.png` while preserving profile sections, tabs, timeline, and historical visibility.
- `/visits/:visitId` must match `Ui_Kit/06-visit-screen.png` while keeping the consultation workflow on one page.
- `/visits/:visitId/prescriptions/new` must match `Ui_Kit/07-prescription-builder.png` while preserving editable medicines and printable output actions.
- `/appointments` must match `Ui_Kit/08-appointments.png` while preserving waiting/completed/cancelled visibility.
- `/settings` must match `Ui_Kit/09-settings.png` for profile, clinic, preferences, toggles, save action, and quick links.

## Role Contract

- Doctor-only routes and actions remain Doctor-only.
- Secretary-only dashboard content remains Secretary-only.
- Shared patient and appointment screens remain available to both roles according to existing route guards.
- Role-restricted actions must not appear as available actions for unauthorized users.

## Component Contract

- Cards, tables, forms, buttons, inputs, filters, badges, status chips, tabs, dialogs, timelines, quick actions, loading states, empty states, and error states must follow a consistent visual system.
- Status and priority indicators must include text, iconography, layout, or labels in addition to color.
- Form validation feedback must remain visible near the relevant input or action.
- Empty states must include guidance and a next action where the workflow supports one.

## Responsiveness Contract

- Desktop is the primary layout and should best match the UI kit references.
- Tablet layouts must preserve task completion and avoid horizontal content loss.
- Mobile layouts must remain functional with accessible navigation and forms even if not optimized for dense clinic workflows.

## Validation Contract

- A screen is complete only when visual review against its reference image and functional smoke validation both pass.
- The final implementation must validate login, role redirects, dashboards, patient search/profile, visit completion, prescription creation/print action, appointments, settings navigation, loading, empty, and error states.
