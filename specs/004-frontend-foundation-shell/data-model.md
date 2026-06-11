# Data Model: Frontend Foundation & Application Shell

## Authenticated User

Represents the signed-in Doctor or Secretary.

**Fields**

- `id`
- `email`
- `name`
- `role`
- `isActive`

**Relationships**

- Drives role-aware navigation and protected route access.
- Provides display information in the user menu and login redirect logic.

**Validation Rules**

- Must be present before protected pages load.
- Role must map to an allowed shell path.

## Navigation Item

Represents a visible destination in the application shell.

**Fields**

- `label`
- `path`
- `icon`
- `roles`

**Relationships**

- Filtered by authenticated user role.
- Renders in the sidebar and supports quick path discovery.

**Validation Rules**

- Must not expose role-restricted destinations to unauthorized users.
- Must keep major sections reachable within two clicks.

## Notification

Represents a non-blocking workflow message.

**Fields**

- `id`
- `type`
- `title`
- `description`

**Relationships**

- Can be created from auth, search, or shell-level events.
- Dismisses independently without affecting page state.

**Validation Rules**

- Type must be one of success, error, warning, or information.
- Must not block access to the current page.

## Patient Search Result

Represents a patient summary shown from global search.

**Fields**

- `id`
- `name`
- `phone`
- `clinicId`
- `notes`
- `isActive`

**Relationships**

- Links from global search to future patient profile routes.

**Validation Rules**

- Search should only show active patients by default.
- Results must be readable without leaving the current screen.

## Shell State

Represents UI state that controls layout behavior.

**Fields**

- `sidebarOpen`
- `currentRoute`
- `breadcrumbLabel`
- `loadingState`
- `errorState`

**Relationships**

- Updated by routing, auth hydration, and data fetching states.

**Validation Rules**

- Must preserve a usable shell across loading and error transitions.
- Mobile sidebar state must not obscure access to primary content after dismissal.
