# Data Model: Medical & Financial Workflow

## Visit

Clinical encounter created by the Doctor for a Patient at a Clinic.

**Fields**: `id`, `patientId`, `clinicId`, `doctorId`, `visitDate`,
`diagnosis`, `treatment`, `status`, `notes`, `createdAt`, `updatedAt`

**Relationships**:

- Belongs to one Patient.
- Belongs to one Clinic.
- Belongs to one Doctor User.
- Has many VisitRevisions.
- Has many Prescriptions.
- May have many Payments.

**Rules**:

- Only Doctors can create or update Visits.
- Patient and Clinic must exist and be active.
- Diagnosis and treatment are required for a complete visit.
- Updates append a VisitRevision before changing the current Visit fields.

## VisitRevision

Historical snapshot of a Visit before or after correction.

**Fields**: `id`, `visitId`, `changedByUserId`, `diagnosis`, `treatment`,
`notes`, `reason`, `createdAt`

**Rules**:

- Revisions are append-only.
- Revisions are never hard deleted through this workflow.

## Prescription

Medication instructions linked to one Visit.

**Fields**: `id`, `visitId`, `doctorId`, `medications`, `instructions`,
`status`, `createdAt`, `updatedAt`

**Relationships**:

- Belongs to one Visit.
- Belongs to one Doctor User.
- Has many PrescriptionRevisions.

**Rules**:

- Only Doctors can create or update Prescriptions.
- A Prescription must belong to an existing Visit.
- PDF output is generated from stored Prescription, Visit, Patient, Clinic, and
  Doctor data.
- Updates append a PrescriptionRevision before changing current fields.

## PrescriptionRevision

Historical snapshot of a Prescription correction.

**Fields**: `id`, `prescriptionId`, `changedByUserId`, `medications`,
`instructions`, `reason`, `createdAt`

**Rules**:

- Revisions are append-only.
- PDF generation uses the current Prescription unless a future spec requests
  historical PDF regeneration.

## Payment

Financial record tied to a Patient and optionally a Visit.

**Fields**: `id`, `patientId`, `visitId`, `clinicId`, `receivedByUserId`,
`totalAmount`, `paidAmount`, `remainingAmount`, `method`, `paidAt`, `notes`,
`createdAt`, `updatedAt`

**Relationships**:

- Belongs to one Patient.
- Optionally belongs to one Visit.
- Belongs to one Clinic.
- Belongs to the User who registered it.
- Has many PaymentRevisions.

**Rules**:

- Doctors and Secretaries can create and view Payments.
- `totalAmount` and `paidAmount` must be zero or greater.
- `paidAmount` cannot exceed `totalAmount`.
- `remainingAmount` is always `totalAmount - paidAmount`.
- Corrections append a PaymentRevision before changing current fields.

## PaymentRevision

Historical snapshot of a Payment correction.

**Fields**: `id`, `paymentId`, `changedByUserId`, `totalAmount`,
`paidAmount`, `remainingAmount`, `method`, `reason`, `createdAt`

**Rules**:

- Revisions are append-only.
- Revisions preserve prior financial facts.

## PaymentMethod

Allowed method used to register a payment.

**Values**:

- `CASH`
- `CARD`
- `BANK_TRANSFER`
- `OTHER`

## Dashboard Summaries

Read-only computed views, not persisted entities.

**Doctor Summary**: total patients, today's appointments, total visits, today's
revenue, monthly revenue, revenue per clinic.

**Secretary Summary**: today's appointments, today's registered patients,
today's payments, outstanding balances.
