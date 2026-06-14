# Data Model: UI Kit Implementation Specification

## UI Kit Screen

Represents one reference screen from `Ui_Kit/` and the corresponding usable application screen.

**Fields**

- `id`
- `referenceImage`
- `route`
- `title`
- `primaryRole`
- `priority`
- `requiredSections`
- `visualStates`

**Relationships**

- Maps to one route or screen entry point.
- Composes reusable interface patterns.
- May contain workflow data already defined by earlier specifications.

**Validation Rules**

- Must follow the UI kit implementation order.
- Must preserve existing route access and workflow behavior.
- Must not use the reference image as a static background.

## Reusable Interface Pattern

Represents a repeated visual or interaction pattern shared across screens.

**Fields**

- `name`
- `purpose`
- `variants`
- `states`
- `accessibilityRequirements`

**Relationships**

- Used by one or more UI kit screens.
- May wrap existing UI primitives or workflow components.

**Validation Rules**

- Must be reused when the same pattern appears on multiple screens.
- Must support loading, empty, error, disabled, active, and selected states where relevant.
- Must communicate status through text or structure, not color alone.

## Workflow Screen

Represents an existing clinic workflow page receiving SPEC 03 visual refinement.

**Fields**

- `route`
- `roleAccess`
- `primaryTask`
- `quickActions`
- `dataStates`
- `acceptanceChecks`

**Relationships**

- Uses one UI kit screen as visual reference.
- Uses existing frontend route guards and feature modules.
- May display patients, appointments, visits, prescriptions, payments, or settings data.

**Validation Rules**

- Must preserve existing protected-route and role behavior.
- Must preserve search, sorting, pagination, form validation, and quick actions already available on the screen.
- Must preserve historical visibility for clinical and financial facts.

## Visual State

Represents a visible condition for a screen or component.

**Fields**

- `state`
- `message`
- `nextAction`
- `statusTreatment`
- `recoveryAction`

**Relationships**

- Belongs to a workflow screen or reusable interface pattern.

**Validation Rules**

- Loading states should preserve shell/navigation context.
- Empty states should guide users to a useful next action.
- Error states should explain the issue and provide recovery where possible.
- Status states must not rely on color alone.

## Screen Mapping

| Order | Reference | Route / Area | Primary Acceptance Focus |
|-------|-----------|--------------|--------------------------|
| 1 | `Ui_Kit/01-login.png` | `/login` | Branding, auth form, recovery entry point, responsive layout |
| 2 | `Ui_Kit/02-doctor-dashboard.png` | `/doctor` | Waiting patients, queue, appointments, recent patients, quick actions |
| 3 | `Ui_Kit/03-secretary-dashboard.png` | `/secretary` | Today's schedule, queue overview, reception quick actions |
| 4 | `Ui_Kit/04-patients-list.png` | `/patients` | Search, filters, add patient, table, pagination, row actions |
| 5 | `Ui_Kit/05-patient-profile.png` | `/patients/:patientId` | Header, overview, history tabs, timeline, information cards |
| 6 | `Ui_Kit/06-visit-screen.png` | `/visits/:visitId` | Patient context, consultation form, diagnosis, notes, timeline, quick actions |
| 7 | `Ui_Kit/07-prescription-builder.png` | `/visits/:visitId/prescriptions/new` | Medicine search, editable rows, dosage, duration, summary, print action |
| 8 | `Ui_Kit/08-appointments.png` | `/appointments` | Calendar context, filters, table, statuses, summary, quick actions |
| 9 | `Ui_Kit/09-settings.png` | `/settings` | Profile, clinic information, preferences, toggles, save action, quick links |
