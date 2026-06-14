# Research: UI Kit Implementation Specification

## Decision: Treat SPEC 03 as a visual implementation over existing workflows

**Rationale**: The feature description and frontend master specification define SPEC 03 as applying the UI reference kit to existing screens. SPEC 01 and SPEC 02 already establish authentication, shell, navigation, dashboards, patient workflows, visit workflow, prescription builder, and appointments.

**Alternatives considered**:

- Rebuild workflows from scratch: rejected because it risks changing already accepted clinic behavior.
- Add new backend features first: rejected because SPEC 03 is visual/UI scope and the spec says to use the UI kit references.

## Decision: Implement screens in the UI kit image order

**Rationale**: The frontend master specification explicitly requires this order: login, Doctor dashboard, Secretary dashboard, patients list, patient profile, visit workspace, prescription builder, appointments, settings. This reduces cross-screen drift by establishing foundation visuals before deeper workflow screens.

**Alternatives considered**:

- Start with shared components only: rejected because the UI kit requires screen-by-screen completion.
- Start with the busiest workflow screen: rejected because the shell and login establish repeated layout rules.

## Decision: Prefer shared primitives before screen-specific styling

**Rationale**: The current frontend already has reusable UI primitives, shell layout, workflow sections, status chips, quick actions, data tables, loading states, and page modules. SPEC 03 requires consistency and future scalability, so repeated visual changes should land in shared primitives where the same pattern appears across screens.

**Alternatives considered**:

- One-off screen styling: rejected because it duplicates behavior and creates visual drift.
- Create a separate design-system package: rejected because the existing app is a single frontend package and a new package is unnecessary for this scope.

## Decision: Preserve existing role, route, and workflow behavior

**Rationale**: SPEC 03 is about visual fidelity and user experience. Doctor/Secretary access, protected routes, form validation, search, pagination, quick actions, and workflow data behavior are existing product contracts and must not regress.

**Alternatives considered**:

- Change navigation and permissions to match the screenshots exactly: rejected because role boundaries and working clinic tasks have higher priority than decorative fidelity.
- Hide incomplete routes: rejected for planning because settings is explicitly part of SPEC 03 and payments remain visible in patient-profile context.

## Decision: Use design review plus functional smoke validation

**Rationale**: UI kit implementation needs both visual comparison against `Ui_Kit/` and functional confirmation that the existing workflows still operate. The current frontend has typecheck, lint, build, and focused `.test.tsx` files but no package test script, so browser smoke/design review is required.

**Alternatives considered**:

- Rely only on automated tests: rejected because visual layout fidelity cannot be confirmed from the current test setup alone.
- Rely only on screenshots/manual review: rejected because route guards, forms, search, and actions can regress during visual changes.

## Decision: Keep backend unchanged

**Rationale**: The existing backend provides auth and clinic data contracts, and SPEC 03 does not ask for data-model or API changes. The plan should not create migrations, routes, or backend services.

**Alternatives considered**:

- Add backend settings APIs now: rejected because settings visual implementation can initially use existing authenticated user and clinic-display assumptions unless a later feature defines persistent settings behavior.
- Add image asset APIs: rejected because UI kit images are references, not runtime assets.
