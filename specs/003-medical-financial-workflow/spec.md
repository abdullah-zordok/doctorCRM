# Feature Specification: Medical & Financial Workflow

**Feature Branch**: `003-medical-financial-workflow`

**Created**: 2026-06-10

**Status**: Draft

**Input**: User description: "Read Doctor_Clinic_Backend_Blueprint .md and create the specification for Spec 003 - Medical & Financial Workflow"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Doctor Records Medical Visit (Priority: P1)

As the Doctor, I can create and update a patient's medical visit with diagnosis
and treatment details so the patient has a reliable clinical history.

**Why this priority**: Medical visits are the foundation for prescriptions,
clinical history, and later financial tracking.

**Independent Test**: Sign in as the Doctor, select an existing patient and
clinic, create a visit with diagnosis and treatment notes, update it with a
correction, and verify previous clinical facts remain historically traceable.

**Acceptance Scenarios**:

1. **Given** an authenticated Doctor and an existing patient and clinic, **When**
   the Doctor creates a visit with diagnosis and treatment details, **Then** the
   visit is linked to that patient, clinic, and Doctor.
2. **Given** an existing visit, **When** the Doctor updates diagnosis or
   treatment details, **Then** the system preserves the visit history and makes
   the current clinical view available.
3. **Given** an authenticated Secretary, **When** the Secretary attempts to
   create or edit diagnosis or treatment details, **Then** the operation is
   denied.

---

### User Story 2 - Doctor Manages Prescriptions and PDFs (Priority: P2)

As the Doctor, I can create prescriptions from stored visit data and generate a
prescription PDF so patients can receive reproducible prescription documents.

**Why this priority**: Prescriptions depend on medical visits and are a core
clinical output required by the constitution.

**Independent Test**: Sign in as the Doctor, create a prescription for an
existing visit, update the prescription with a correction, retrieve it, generate
the PDF, and verify the PDF reflects stored prescription data.

**Acceptance Scenarios**:

1. **Given** an existing visit, **When** the Doctor creates a prescription with
   medication instructions, **Then** the prescription is linked to that visit.
2. **Given** an existing prescription, **When** the Doctor requests a PDF,
   **Then** the generated document contains patient, visit, Doctor, and
   prescription details from stored records.
3. **Given** an authenticated Secretary, **When** the Secretary attempts to
   create or edit a prescription, **Then** the operation is denied.

---

### User Story 3 - Staff Register Payments (Priority: P3)

As a Doctor or Secretary, I can register patient payments with total, paid, and
remaining amounts so the clinic can track balances without corrupting financial
history.

**Why this priority**: Payment registration completes the operational workflow
for visits and appointments while preserving financial records.

**Independent Test**: Sign in as a Secretary, register a payment for an existing
patient or visit, verify remaining balance equals total minus paid, reject
negative values and overpayment, and confirm the payment record remains
auditable after correction.

**Acceptance Scenarios**:

1. **Given** an existing patient or visit, **When** staff registers a payment
   with valid total and paid amounts, **Then** the remaining balance is
   calculated and visible.
2. **Given** a payment request where paid exceeds total, **When** staff submits
   it, **Then** the system rejects the payment and records no invalid balance.
3. **Given** an existing payment, **When** staff corrects payment information,
   **Then** the correction preserves the original financial record context.

---

### User Story 4 - View Operational and Financial Dashboards (Priority: P4)

As the Doctor or Secretary, I can view role-appropriate dashboard summaries so
daily clinic operations and financial status are visible without exposing
restricted information.

**Why this priority**: Dashboards summarize completed workflows and must respect
Doctor and Secretary permissions.

**Independent Test**: Sign in as the Doctor and view patient, appointment,
visit, revenue, and clinic revenue summaries; sign in as a Secretary and verify
only today's operational and payment balance summaries are visible.

**Acceptance Scenarios**:

1. **Given** an authenticated Doctor, **When** the Doctor opens dashboard
   summaries, **Then** total patients, today's appointments, total visits,
   today's revenue, monthly revenue, and revenue per clinic are available.
2. **Given** an authenticated Secretary, **When** the Secretary opens dashboard
   summaries, **Then** today's appointments, today's registered patients,
   today's payments, and outstanding balances are available.
3. **Given** an authenticated Secretary, **When** the Secretary attempts to view
   detailed financial reports, **Then** the system denies access.

---

### Edge Cases

- A visit is requested for a missing, inactive, or unassigned patient.
- A visit is requested for a missing or inactive clinic.
- A Secretary attempts to create diagnoses, treatments, prescriptions, or access
  detailed Doctor financial reports.
- A prescription PDF is requested before prescription details exist.
- A prescription is updated after a PDF has previously been generated.
- A payment uses negative total, paid, or remaining values.
- A payment request has paid amount greater than total amount.
- A payment is registered for a missing patient or visit.
- Revenue reports include days or months with no payments.
- Dashboard summaries include cancelled appointments or inactive records.
- Corrections are made to medical or financial records after initial creation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow Doctors to create, view, list, and update
  medical visits for existing patients and clinics.
- **FR-002**: System MUST link each visit to a Patient, Clinic, and Doctor.
- **FR-003**: System MUST allow Doctors to record diagnoses and treatments as
  part of a medical visit.
- **FR-004**: System MUST prevent Secretaries from creating or editing
  diagnoses, treatments, visits, or prescriptions.
- **FR-005**: System MUST preserve medical visit history when visit details are
  corrected or updated.
- **FR-006**: System MUST allow Doctors to create, view, and update
  prescriptions for existing visits.
- **FR-007**: System MUST generate prescription PDFs from stored patient, visit,
  Doctor, and prescription data.
- **FR-008**: System MUST preserve prior prescription data when prescriptions are
  corrected or updated.
- **FR-009**: System MUST allow Doctors and Secretaries to create and view
  payments for patients or visits according to role permissions.
- **FR-010**: System MUST calculate remaining payment balance as total amount
  minus paid amount.
- **FR-011**: System MUST reject payments with negative amounts, missing
  required amounts, or paid amount greater than total amount.
- **FR-012**: System MUST preserve financial records when payment information is
  corrected or updated.
- **FR-013**: System MUST allow Doctors to view detailed financial summaries,
  including today's revenue, monthly revenue, and revenue per clinic.
- **FR-014**: System MUST allow Secretaries to view operational payment
  summaries, today's payments, and outstanding balances only.
- **FR-015**: System MUST provide Doctor dashboard summaries for total patients,
  today's appointments, total visits, today's revenue, monthly revenue, and
  revenue per clinic.
- **FR-016**: System MUST provide Secretary dashboard summaries for today's
  appointments, today's registered patients, today's payments, and outstanding
  balances.
- **FR-017**: System MUST support filtering medical visits, prescriptions,
  payments, and reports by patient, clinic, date range, and status where
  relevant.
- **FR-018**: System MUST validate and sanitize every medical, prescription,
  payment, report, and dashboard request before applying changes or returning
  results.
- **FR-019**: System MUST return consistent JSON success and error responses for
  all medical and financial operations.
- **FR-020**: System MUST NOT include insurance management, pharmacy
  integration, notifications, file uploads, OCR, frontend screens, multi-doctor
  support, or multi-tenant SaaS behavior in this specification.

### Key Entities *(include if feature involves data)*

- **Visit**: A clinical encounter tied to a patient, clinic, and Doctor; includes
  diagnosis, treatment, visit date, status, and history of corrections.
- **Diagnosis**: Clinical assessment recorded by the Doctor during a visit.
- **Treatment**: Treatment instructions or care plan recorded by the Doctor
  during a visit.
- **Prescription**: Medication and usage instructions linked to one visit and
  generated into a reproducible prescription PDF.
- **Prescription PDF**: A generated document based only on stored prescription,
  visit, patient, and Doctor data.
- **Payment**: Financial record tied to a patient or visit; includes total
  amount, paid amount, remaining balance, payment method, date, and correction
  history.
- **PaymentMethod**: The method used to register a payment, such as cash or card.
- **Doctor Dashboard Summary**: Role-restricted clinical and financial summary
  for the Doctor.
- **Secretary Dashboard Summary**: Role-restricted operational and payment
  summary for the Secretary.

### Constitution Alignment *(mandatory)*

- **Backend API**: Medical visits, prescriptions, prescription PDFs, payments,
  and dashboard summaries are exposed as protected backend operations with
  consistent JSON responses.
- **Auth/RBAC**: Doctors manage medical visits, diagnoses, treatments,
  prescriptions, PDFs, and detailed financial reports; Secretaries can register
  payments and view limited operational summaries.
- **Validation/Sanitization**: Every create, update, filter, report, dashboard,
  and PDF request must be validated and sanitized before execution.
- **Historical Integrity**: Medical visits, diagnoses, treatments,
  prescriptions, PDFs, payments, and financial corrections must preserve prior
  facts instead of overwriting history.
- **Prescription PDFs**: PDFs must be generated from stored prescription data so
  the same record can be reproduced later.
- **SaaS Extensibility**: Records must remain compatible with future
  multiple-doctor and tenant separation by keeping ownership and clinic
  relationships explicit.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A Doctor can create a complete visit with diagnosis and treatment
  for an existing patient in under 3 minutes using valid information.
- **SC-002**: 100% of Secretary attempts to create or edit medical diagnoses,
  treatments, visits, or prescriptions are denied.
- **SC-003**: A Doctor can create a prescription and generate its PDF in under 2
  minutes after a visit exists.
- **SC-004**: 100% of generated prescription PDFs reflect stored prescription,
  patient, visit, and Doctor information for the selected prescription.
- **SC-005**: 100% of invalid payment attempts with negative amounts or paid
  amount greater than total amount are rejected.
- **SC-006**: Payment remaining balance is calculated correctly for 100% of valid
  payment scenarios in acceptance testing.
- **SC-007**: 100% of medical and financial corrections preserve prior record
  history instead of permanently replacing facts.
- **SC-008**: Doctor dashboard summaries show all required clinical and revenue
  metrics for the selected period in at least 95% of valid report checks.
- **SC-009**: Secretary dashboard summaries exclude detailed financial reports in
  100% of restricted access checks.

## Assumptions

- Spec 001 authentication, authorization, validation, and consistent response
  behavior already exist and are reused.
- Spec 002 administrative workflows for patients, clinics, and appointments
  already exist and are reused.
- The MVP remains single-doctor, but Visit, Prescription, Payment, and dashboard
  records must not block future multiple-doctor or SaaS support.
- Prescription PDF generation is part of this specification; storing uploaded
  files or external attachments is not.
- Payments may be associated with a patient and, when available, a visit; future
  specifications can add insurance or third-party billing.
- Financial values use clinic currency consistently, and currency conversion is
  out of scope.
- Dashboards summarize stored records and do not require notifications,
  scheduled exports, or frontend screens.
