# Research: Administrative Workflow

## Decisions

### Secretary Accounts

**Decision**: Model secretaries as existing `User` records with `role =
SECRETARY`.

**Rationale**: Spec 001 already provides users, roles, password hashing,
authentication, and current-user lookup. Reusing `User` avoids duplicate
credential storage and keeps login behavior consistent.

**Alternatives Considered**: A separate `Secretary` credential table was
rejected because it would duplicate authentication rules and complicate RBAC.

### Doctor-Only Administration

**Decision**: Only Doctors can create, update, list, and change status for
secretary accounts and clinics, while Doctors and Secretaries can manage
patients and appointments.

**Rationale**: This directly enforces the specification and prevents privilege
escalation through administrative endpoints.

**Alternatives Considered**: Allowing Secretaries to manage clinics was rejected
because clinic setup is a Doctor-owned prerequisite.

### Soft Status Changes

**Decision**: Use `isActive` for Secretaries, Clinics, and Patients; use
appointment `status` for cancellation and scheduling state.

**Rationale**: Status changes preserve administrative history and satisfy the
constitution requirement to avoid destructive record removal.

**Alternatives Considered**: Hard deletion was rejected because cancelled
appointments and inactive administrative records must remain auditable.

### Pagination

**Decision**: Use shared pagination parsing with `page >= 1`, default `pageSize`
of 20, maximum `pageSize` of 100, and metadata `{ page, pageSize, total,
totalPages }`.

**Rationale**: The existing response envelope can carry predictable list data
and page metadata across all administrative resources.

**Alternatives Considered**: Cursor pagination was rejected for this MVP because
administrative screens need simple page navigation and filtering.

### Search and Filters

**Decision**: Patient search matches name or phone with case-insensitive
contains semantics. Patient filters support clinic and status. Appointment
filters support date, clinic, patient, and status.

**Rationale**: These are the exact discovery workflows required by the spec and
are straightforward to express through Prisma queries.

**Alternatives Considered**: Full-text search was rejected as unnecessary for
the MVP and can be introduced later without changing API contracts.

### Appointment Validation

**Decision**: Appointment creation requires an active patient, active clinic,
valid scheduled datetime, and valid status. Advanced calendar conflict detection
is out of scope.

**Rationale**: The specification explicitly limits conflict prevention to basic
validity rules for this feature.

**Alternatives Considered**: Preventing overlapping appointments was rejected
for now because business rules for duration, providers, and rooms are not yet
specified.

### Response Shape

**Decision**: Reuse the existing JSON success/error envelope and add list
metadata inside `data.meta`.

**Rationale**: Spec 001 established response helpers; extending them preserves
contract consistency.

**Alternatives Considered**: A new response envelope was rejected because it
would fragment client behavior.
