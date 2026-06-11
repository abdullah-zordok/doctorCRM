# Data Model: Clinic Workflow Experience

## Dashboard Item

Represents an operational prompt on a role-specific dashboard.

**Fields**

- `id`
- `type`
- `title`
- `subtitle`
- `priority`
- `status`
- `actionLabel`
- `target`

**Relationships**

- May reference a patient, appointment, visit, or prescription.
- Displayed differently for Doctor and Secretary roles.

**Validation Rules**

- Must identify a next action when action is available.
- Must not expose role-restricted actions.

## Patient

Represents the person receiving care.

**Fields**

- `id`
- `patientCode`
- `name`
- `phone`
- `clinic`
- `notes`
- `isActive`

**Relationships**

- Has appointments, visits, prescriptions through visits, payments, and timeline events.

**Validation Rules**

- Search must support name, phone number, and patient code.
- Profile sections must remain accessible without long unstructured scrolling.

## Patient Timeline Event

Represents a chronological patient activity item.

**Fields**

- `id`
- `type`
- `occurredAt`
- `title`
- `description`
- `status`
- `sourceId`

**Relationships**

- Belongs to a patient.
- May refer to a visit, prescription, appointment, or payment.

**Validation Rules**

- Must preserve historical visibility.
- Must not hide cancelled, completed, or corrected activity.

## Visit

Represents a clinical consultation.

**Fields**

- `id`
- `patientId`
- `visitDate`
- `chiefComplaint`
- `diagnosis`
- `clinicalNotes`
- `followUpNotes`
- `status`

**Relationships**

- Belongs to a patient and doctor.
- May have prescriptions and payments.

**Validation Rules**

- Doctor-only clinical edit actions.
- Consultation workspace must keep required visit fields visible on one page.

**State Transitions**

- `open` to `completed`
- `open` to `cancelled`
- Completed or corrected facts remain visible through history.

## Prescription

Represents medicines and instructions issued during a visit.

**Fields**

- `id`
- `visitId`
- `medicines`
- `instructions`
- `notes`
- `status`
- `createdAt`

**Relationships**

- Belongs to a visit and doctor.
- Produces printable prescription output.

**Validation Rules**

- Must support multiple medicines.
- Each medicine row should include dosage and duration.
- Printable output must be based on saved prescription details.

## Appointment

Represents a scheduled patient encounter.

**Fields**

- `id`
- `patientId`
- `scheduledAt`
- `status`
- `notes`
- `priority`

**Relationships**

- Belongs to a patient and clinic.
- Can lead to a visit.

**Validation Rules**

- Waiting appointments must be visually prioritized.
- Completed appointments remain visible lower in the view.
- Cancelled appointments remain visible and visually distinct.

**State Transitions**

- `scheduled` to `waiting`
- `waiting` to `completed`
- `scheduled` or `waiting` to `cancelled`
- `scheduled` to `no_show`

## Quick Action

Represents a high-frequency action exposed in dashboards and workflow pages.

**Fields**

- `id`
- `label`
- `target`
- `role`
- `context`

**Relationships**

- May be attached to dashboards, patient profiles, appointment rows, visit pages, and prescription pages.

**Validation Rules**

- Must be visible where the action is commonly needed.
- Must honor Doctor and Secretary role boundaries.
