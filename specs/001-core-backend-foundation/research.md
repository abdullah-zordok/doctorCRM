# Research: Core Backend Foundation

## Decision: Node.js 20 LTS with TypeScript

**Rationale**: Node.js 20 LTS gives a stable runtime for the backend foundation,
and TypeScript adds compile-time checks for controllers, services, middleware,
request context, and Prisma-generated types.

**Alternatives considered**: Newer non-LTS Node versions were rejected because
foundation work should prioritize stability over latest runtime features.

## Decision: Express.js modular REST API

**Rationale**: Express matches the project constitution and blueprint. Domain
modules keep routes, controllers, services, and validation close together while
preserving thin controllers.

**Alternatives considered**: A larger framework was rejected because this
foundation needs simple, explicit module boundaries without extra conventions.

## Decision: Prisma with PostgreSQL migrations and seed script

**Rationale**: Prisma provides typed database access, explicit migrations, and a
repeatable seed path for the initial Doctor account. PostgreSQL is the required
database and supports future medical and financial records.

**Alternatives considered**: Raw SQL-only access was rejected because it would
increase boilerplate and reduce type safety for early foundation work.

## Decision: JWT access token with active-user checks

**Rationale**: JWT supports stateless authentication across the future doctor
and secretary dashboards. Protected requests must still load the user and verify
active status so disabled users cannot continue access.

**Alternatives considered**: Server-side sessions were rejected for the first
foundation because they add session storage before there is a product need.

## Decision: Logout is client token disposal plus consistent API response

**Rationale**: With stateless JWT access tokens, logout can return success and
instruct clients to discard the token. Token revocation can be added later if
refresh tokens or session records become part of the product.

**Alternatives considered**: Token deny-list storage was rejected for Spec 001
because it adds state without a stated security requirement.

## Decision: Zod validation and sanitization middleware

**Rationale**: Zod gives a single validation schema style for body, query, and
params. Sanitization should trim strings and reject unexpected fields before
service execution.

**Alternatives considered**: Ad hoc validation in controllers was rejected
because it violates the thin-controller principle and makes behavior
inconsistent.

## Decision: Vitest and Supertest

**Rationale**: Vitest is fast for TypeScript unit and integration tests, while
Supertest verifies Express HTTP behavior against the API contract.

**Alternatives considered**: Jest was considered but rejected to keep the test
runner lightweight and fast for the first backend foundation.

## Decision: Docker Compose with backend and postgres services

**Rationale**: The constitution requires the full project to run with Docker
Compose. Spec 001 only needs backend and PostgreSQL services; a future frontend
service can be added without changing the backend foundation.

**Alternatives considered**: Local database installation was rejected because it
breaks repeatable setup and onboarding.
