# Research: Clinic Workflow Experience

## 1. Dashboard Priority Model

**Decision**: Treat dashboards as operational work queues, not analytics pages.

**Rationale**: SPEC 02 states that the doctor should immediately know what requires attention and that the secretary should perform daily tasks without unnecessary navigation.

**Alternatives considered**: KPI-first dashboard and generic admin overview. These were rejected because they bury active clinic work beneath secondary information.

## 2. Patient Search and Patient Code

**Decision**: Support patient search by name, phone number, and patient code in the frontend workflow. If the backend does not expose a dedicated patient code, display and search against the stable patient identifier available from the system until a dedicated code is available.

**Rationale**: The frontend master spec explicitly requires patient code search, while the current workflow must still remain usable with existing patient records.

**Alternatives considered**: Removing patient code search or adding a frontend-only generated code. Removing it would violate SPEC 02; a frontend-only generated code could confuse users if it diverges from future clinic records.

## 3. Patient Profile Organization

**Decision**: Use sectioned navigation for patient profile content: basic information, medical history, visits, prescriptions, appointments, payments, and timeline.

**Rationale**: SPEC 02 requires avoiding long scrolling pages and making the profile a central information hub.

**Alternatives considered**: Single long page and separate pages for each profile section. A long page makes review slow; separate pages increase navigation cost.

## 4. Visit Workspace

**Decision**: Keep the doctor consultation workspace on one page with patient context, chief complaint, diagnosis, clinical notes, follow-up notes, visit information, and quick actions.

**Rationale**: The doctor should complete the entire visit without leaving the page.

**Alternatives considered**: Step-by-step wizard and separate notes/prescription pages. These add extra navigation during the consultation.

## 5. Prescription Builder

**Decision**: Model prescription creation as an editable builder with medicine rows, dosage, duration, instructions, notes, summary, and printable output action.

**Rationale**: Prescription creation must be fast, support multiple medicines, and minimize typing.

**Alternatives considered**: Plain textarea prescription entry and separate medicine pages. These reduce structure and slow routine prescriptions.

## 6. Appointment Priority

**Decision**: Sort appointment views so waiting or active appointments receive visual priority, completed appointments move lower, and cancelled appointments remain visible with distinct status treatment.

**Rationale**: SPEC 02 requires today's schedule to dominate the appointment view while preserving status visibility.

**Alternatives considered**: Chronological-only ordering and hiding completed/cancelled appointments. These make current work harder to scan or reduce operational traceability.

## 7. Loading, Empty, and Error States

**Decision**: Use skeleton loading, guided empty states, and recoverable error states for all workflow pages.

**Rationale**: SPEC 02 explicitly forbids blank screens and blocking interfaces.

**Alternatives considered**: Spinner-only loading and silent empty screens. These do not guide clinic users toward the next action.
