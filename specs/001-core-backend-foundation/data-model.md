# Data Model: Core Backend Foundation

## User

Represents an account that can authenticate and access protected backend
operations.

### Fields

- `id`: Unique identifier.
- `email`: Unique login email, stored lowercase.
- `name`: Display name for the authenticated user.
- `passwordHash`: Protected password hash, never returned in responses.
- `role`: Role enum value, initially `DOCTOR` or `SECRETARY`.
- `isActive`: Boolean access flag. Inactive users cannot authenticate or access
  protected routes.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.

### Validation Rules

- `email` must be valid email format, unique, and normalized to lowercase.
- `name` must be non-empty after trimming.
- `passwordHash` must only store a hash generated from an accepted password.
- `role` must be one of the supported role values.
- `isActive` defaults to true for the initial Doctor seed account.

### State Transitions

- `active -> inactive`: User can no longer authenticate or access protected
  routes.
- `inactive -> active`: User can authenticate again if credentials are valid.
- Hard deletion is not used for foundation accounts.

## Role

Enum used for authorization decisions.

### Values

- `DOCTOR`: Full system owner role for future doctor dashboard operations.
- `SECRETARY`: Administrative role for future secretary dashboard operations.

### Validation Rules

- All protected role checks must compare against explicit enum values.
- Unknown role values are rejected.

## Authenticated Session

Represents a successful sign-in from the API consumer perspective. The first
implementation uses a signed token rather than a persisted session row.

### Fields

- `accessToken`: Signed credential returned after successful login.
- `expiresAt`: Token expiry timestamp or duration communicated to the client.
- `user`: Safe user summary containing `id`, `email`, `name`, `role`, and
  `isActive`.

### Validation Rules

- Tokens must be signed with server configuration.
- Expired, malformed, or tampered tokens are rejected.
- Protected requests must verify the token and load the active user.

## Initial Doctor Seed

The first Doctor account used to enter a fresh system.

### Rules

- Seed execution must be idempotent.
- Re-running seed must not create duplicate Doctor accounts.
- Seed credentials must be configurable for local setup and changed before
  production use.
