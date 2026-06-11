# Frontend Shell Contract

## Purpose

Define the user-facing routes, role behavior, and shared interaction expectations for the frontend foundation.

## Route Contract

- `/login` is the public sign-in entry point.
- `/doctor` is the default Doctor landing route.
- `/secretary` is the default Secretary landing route.
- `/patients`, `/appointments`, `/visits`, `/prescriptions`, `/payments`, and `/settings` are protected shell routes.

## Access Contract

- Unauthenticated users must be redirected to `/login`.
- Doctor users must not see Secretary-only destinations.
- Secretary users must not see Doctor-only destinations.
- The shell must preserve the user’s place while switching between major sections.

## Search Contract

- Global search must be available from the top navigation on protected pages.
- Search should present results inline and keep the current page visible.
- Empty and unavailable states must be clearly labeled.

## Notification Contract

- The shell must support success, error, warning, and information notifications.
- Notifications must not block navigation or data entry.
- Notifications must be dismissible individually.

## Loading and Error Contract

- Protected pages must show loading feedback rather than a blank screen while auth state or page data resolves.
- Empty states must provide a clear message and, where relevant, a next action.
- Error states must explain the failure and allow recovery when possible.
