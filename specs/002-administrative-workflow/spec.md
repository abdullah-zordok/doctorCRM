# Feature Specification: Administrative Workflow

**Feature Branch**: `002-administrative-workflow`

**Created**: 2026-06-10

**Status**: Draft

**Input**: User description: "read the Doctor_Clinic_Backend_Blueprint .md and make the specification of the Spec 002 - Administrative Workflow"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Doctor Sets Up Administration (Priority: P1)

As the Doctor, I can manage secretary accounts and clinics so the clinic has
approved staff and active locations before patient and appointment work begins.

**Why this priority**: Secretaries and clinics are prerequisites for patient
registration and appointment scheduling.

**Independent Test**: Sign in as the Doctor, create a secretary, create a
clinic, update each record, change each status, and verify a Secretary cannot
create Doctor accounts or change Doctor permissions.

**Acceptance Scenarios**:

1. **Given** an authenticated Doctor, **When** the Doctor creates a Secretary
   with valid information, **Then** the Secretary is available for login and
   administrative assignment.
2. **Given** an authenticated Doctor, **When** the Doctor creates or updates a
   Clinic, **Then** the Clinic appears in clinic lists and can be selected for
   patients and appointments.
3. **Given** an authenticated Secretary, **When** the Secretary attempts to
   create a Doctor account or change Doctor permissions, **Then** the system
   denies the operation.

---

### User Story 2 - Secretary Manages Patients (Priority: P2)

As a Secretary, I can register, edit, search, and filter patients using
administrative patient information so patient records are ready for appointments
and later medical visits.

**Why this priority**: Patient registration is the main administrative workflow
before scheduling and medical work.

**Independent Test**: Sign in as a Secretary, register a patient with name,
phone, and clinic, edit administrative details, search by name or phone, filter
by clinic/status, paginate results, and verify permanent deletion is unavailable.

**Acceptance Scenarios**:

1. **Given** an authenticated Secretary and an active Clinic, **When** the
   Secretary registers a patient with name, phone, and clinic, **Then** the
   patient becomes searchable and visible in paginated patient lists.
2. **Given** an existing patient, **When** the Secretary updates administrative
   details, **Then** the updated information appears without removing the patient
   record.
3. **Given** an existing patient, **When** the Secretary changes the patient
   status, **Then** the patient is excluded or included according to status
   filters and is not permanently deleted.

---

### User Story 3 - Staff Manage Appointments (Priority: P3)

As a Doctor or Secretary, I can create, update, filter, and cancel appointments
for existing patients and clinics so daily clinic schedules can be managed
without touching medical visit records.

**Why this priority**: Appointment management depends on clinics and patients
and completes the administrative workflow for this specification.

**Independent Test**: Create an appointment for an existing active patient and
clinic, update its administrative details, cancel it through a status change,
and verify listing by date, clinic, patient, status, and pagination.

**Acceptance Scenarios**:

1. **Given** an existing active patient and clinic, **When** staff creates an
   appointment, **Then** it appears in appointment lists and can be filtered by
   date, clinic, patient, and status.
2. **Given** an appointment, **When** staff updates time, clinic, patient, or
   status using valid values, **Then** the appointment reflects the change
   without creating medical visit or payment records.
3. **Given** an appointment, **When** staff cancels it, **Then** the appointment
   remains historically visible with a cancelled status.

---

### Edge Cases

- Secretary attempts to create Doctor accounts or change Doctor permissions.
- Secretary attempts to permanently delete a patient, clinic, secretary, or
  appointment.
- Patient registration is submitted without name, phone, or clinic.
- Appointment creation references a missing or inactive patient.
- Appointment creation references a missing or inactive clinic.
- Search returns no patients or appointments.
- Pagination requests a page beyond available results.
- Filters are combined, such as clinic plus status plus search text.
- Duplicate patient phone numbers are submitted for different people.
- Appointment status changes are repeated or requested from an already cancelled
  appointment.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow Doctors to create, view, update, list, and
  change status for Secretary accounts.
- **FR-002**: System MUST prevent Secretaries from creating Doctor accounts,
  changing Doctor permissions, or assigning themselves Doctor access.
- **FR-003**: System MUST allow Doctors to create, view, update, list, and
  change status for Clinics.
- **FR-004**: System MUST allow Doctors and Secretaries to view available active
  Clinics for administrative workflows.
- **FR-005**: System MUST allow Doctors and Secretaries to create Patients with
  at least name, phone, and Clinic.
- **FR-006**: System MUST allow Doctors and Secretaries to view, list, search,
  filter, and update administrative Patient information.
- **FR-007**: System MUST use status changes instead of permanent deletion for
  Secretaries, Clinics, Patients, and Appointments.
- **FR-008**: System MUST allow Doctors and Secretaries to create Appointments
  only for existing active Patients and active Clinics.
- **FR-009**: System MUST allow Doctors and Secretaries to update Appointment
  administrative details and status.
- **FR-010**: System MUST allow Doctors and Secretaries to cancel Appointments by
  status change while preserving the appointment record.
- **FR-011**: System MUST support search by patient name and phone.
- **FR-012**: System MUST support paginated list views for Secretaries, Clinics,
  Patients, and Appointments.
- **FR-013**: System MUST support filtering Patients and Appointments by clinic
  and status, and Appointments by date.
- **FR-014**: System MUST validate and sanitize every administrative request
  before applying changes.
- **FR-015**: System MUST return consistent JSON success and error responses for
  all administrative operations.
- **FR-016**: System MUST enforce Doctor and Secretary permissions on every
  administrative operation.
- **FR-017**: System MUST NOT include medical visits, diagnoses, treatments,
  prescriptions, prescription PDFs, payments, dashboards, notifications, file
  uploads, frontend workflows, or detailed financial reports in this
  specification.

### Key Entities *(include if feature involves data)*

- **Secretary**: A user with administrative permissions who can manage patients
  and appointments but cannot create Doctor accounts or change Doctor
  permissions.
- **Clinic**: A clinic location managed by the Doctor and referenced by patients
  and appointments.
- **Patient**: A person registered for administrative clinic workflows; includes
  name, phone, clinic assignment, status, and searchable administrative details.
- **Appointment**: A scheduled administrative event tied to an existing patient
  and clinic, with date/time and status.
- **AppointmentStatus**: The state of an appointment, including active scheduled
  states and cancelled states.

### Constitution Alignment *(mandatory)*

- **Backend API**: Administrative operations cover secretary, clinic, patient,
  and appointment workflows with consistent JSON responses.
- **Auth/RBAC**: Doctor-only operations include Secretary and Clinic management;
  Secretary operations are limited to patient and appointment administration.
- **Validation/Sanitization**: Every create, update, search, filter, pagination,
  and status-change request must be validated and sanitized before execution.
- **Historical Integrity**: Administrative records use status changes instead of
  hard deletion; appointments remain visible after cancellation.
- **Prescription PDFs**: Prescription workflows and PDFs are excluded from this
  specification.
- **SaaS Extensibility**: Records must avoid assumptions that would prevent
  future multiple doctors, multiple clinics, or SaaS tenant separation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A Doctor can create one Secretary and one Clinic in under 3
  minutes using valid inputs.
- **SC-002**: 100% of attempts by Secretaries to create Doctor accounts or
  change Doctor permissions are denied.
- **SC-003**: A Secretary can register a patient with name, phone, and clinic in
  under 2 minutes.
- **SC-004**: Patient search by name or phone returns matching records for at
  least 95% of valid search attempts in test scenarios.
- **SC-005**: Appointment creation fails 100% of the time when the patient or
  clinic does not exist or is inactive.
- **SC-006**: 100% of delete-like administrative actions preserve records through
  status changes instead of permanent removal.
- **SC-007**: Paginated administrative lists consistently return page metadata
  and no more than the requested page size.

## Assumptions

- Spec 001 authentication, current-user lookup, and role middleware already
  exist and are reused.
- The MVP remains single-doctor, but the administrative model must not block
  future multiple-doctor or SaaS support.
- Patient phone numbers are important for search, but duplicates are allowed
  unless future clarification makes phone uniqueness a product rule.
- Appointment conflict prevention is limited to valid patient, clinic, date/time,
  and status rules in this specification; advanced calendar conflict detection
  can be added later.
- Payments, medical visits, prescriptions, dashboards, and frontend screens are
  handled by later specifications.
