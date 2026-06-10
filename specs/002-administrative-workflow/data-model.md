# Data Model: Administrative Workflow

## User / Secretary

Existing `User` records represent both Doctors and Secretaries.

**Fields**: `id`, `email`, `name`, `passwordHash`, `role`, `isActive`,
`createdAt`, `updatedAt`

**Rules**:

- Secretary records MUST use `role = SECRETARY`.
- Administrative secretary endpoints MUST NOT create or assign `DOCTOR`.
- Status changes set `isActive`; records are not deleted.
- Inactive Secretaries cannot authenticate or perform protected workflows.

## Clinic

Clinic location used for patient registration and appointment scheduling.

**Fields**: `id`, `name`, `phone`, `address`, `isActive`, `createdAt`,
`updatedAt`

**Relationships**:

- One Clinic has many Patients.
- One Clinic has many Appointments.

**Rules**:

- Doctors manage Clinic create/update/status operations.
- Doctors and Secretaries can view active Clinics for administrative workflows.
- Inactive Clinics cannot be assigned to new Patients or Appointments.

## Patient

Administrative patient profile for scheduling and future medical workflows.

**Fields**: `id`, `name`, `phone`, `clinicId`, `notes`, `isActive`,
`createdAt`, `updatedAt`

**Relationships**:

- Patient belongs to one Clinic.
- Patient has many Appointments.

**Rules**:

- `name`, `phone`, and active `clinicId` are required.
- Duplicate phone numbers are allowed.
- Search matches `name` or `phone`.
- Status changes set `isActive`; records are not deleted.

## Appointment

Administrative schedule record tied to a patient and clinic.

**Fields**: `id`, `patientId`, `clinicId`, `scheduledAt`, `status`, `notes`,
`createdAt`, `updatedAt`

**Relationships**:

- Appointment belongs to one Patient.
- Appointment belongs to one Clinic.

**Rules**:

- Appointment creation requires an active Patient and active Clinic.
- Cancellation changes `status` to `CANCELLED`; records are not deleted.
- Listing supports filters by date, clinic, patient, status, and pagination.
- Medical visits, prescriptions, and payments are not created by this model.

## AppointmentStatus

Allowed appointment states.

**Values**:

- `SCHEDULED`
- `COMPLETED`
- `CANCELLED`
- `NO_SHOW`

**Rules**:

- New appointments default to `SCHEDULED`.
- Repeated status updates are idempotent when the requested status already
  matches the current status.

## PaginatedResult

Shared list response shape.

**Fields**: `items`, `meta.page`, `meta.pageSize`, `meta.total`,
`meta.totalPages`

**Rules**:

- `page` is 1-based.
- Default `pageSize` is 20.
- Maximum `pageSize` is 100.
