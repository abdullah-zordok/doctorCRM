# Research: Frontend Foundation & Application Shell

## 1. Role-Based Authentication

**Decision**: Use the existing backend login and current-user endpoints as the source of truth for session state and role-based redirection.

**Rationale**: The backend already issues access tokens and returns the signed-in user record, which keeps the frontend thin and consistent with existing security behavior.

**Alternatives considered**: Local-only mock auth, third-party identity provider, and client-side role spoofing. These were rejected because they would diverge from the existing clinic backend and weaken access control.

## 2. Application Shell Structure

**Decision**: Build a persistent shell with sidebar, top navigation, breadcrumbs, user menu, notification access, and a main content region shared across protected routes.

**Rationale**: The frontend spec emphasizes speed and minimal clicks, so the shell must stay fixed while page content changes.

**Alternatives considered**: Full-screen per-page layouts and nested navigation panels. These were rejected because they add cognitive load and make future module expansion harder.

## 3. Global Patient Search

**Decision**: Place patient search in the top navigation and present results inline without navigation away from the current page.

**Rationale**: Patient lookup is a frequent action and should remain available from every protected screen.

**Alternatives considered**: Dedicated search page and modal-only search. These were rejected because they interrupt clinic flow or hide search behind extra steps.

## 4. Notifications

**Decision**: Use non-blocking toast-style notifications for success, error, warning, and information states.

**Rationale**: The frontend spec requires feedback that never interrupts workflow.

**Alternatives considered**: Modal alerts and full-page banners. These were rejected because they block or over-dominate the shell experience.

## 5. Shared UI Primitives

**Decision**: Build reusable primitives for buttons, cards, inputs, tables, dialogs, tabs, dropdowns, tooltips, pagination, empty states, loading states, and error states.

**Rationale**: SPEC 02 and SPEC 03 will reuse the foundation heavily, so the shell needs a coherent component set before workflow screens arrive.

**Alternatives considered**: One-off page components and duplicated screen-level UI. These were rejected because they create drift and slow future delivery.

## 6. Responsive Behavior

**Decision**: Make desktop the primary experience, keep tablet fully usable, and preserve functional mobile navigation through a collapsible sidebar.

**Rationale**: The frontend specification explicitly prioritizes desktop while requiring usable mobile support.

**Alternatives considered**: Mobile-first redesign and desktop-only layout. These were rejected because they conflict with the product vision.
