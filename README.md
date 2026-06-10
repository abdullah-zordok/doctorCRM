# Doctor Clinic Management System Backend

Backend-first foundation for the Doctor Clinic Management System.

## Spec 001: Core Backend Foundation

The current implementation covers Dockerized backend startup, PostgreSQL,
Prisma, the initial Doctor seed account, JWT authentication, Doctor/Secretary
RBAC foundations, request validation, consistent JSON responses, global error
handling, and readiness checks.

See the Spec 001 quickstart for full setup and verification steps:

- [Core Backend Foundation Quickstart](specs/001-core-backend-foundation/quickstart.md)

## Local Commands

```bash
cd backend
pnpm install
pnpm prisma generate
pnpm typecheck
pnpm test
pnpm build
pnpm lint
```

Start the full local runtime:

```bash
docker compose up --build
```

Run migrations and seed the initial Doctor account inside the backend service:

```bash
docker compose exec backend pnpm prisma migrate dev
docker compose exec backend pnpm prisma db seed
```

Spec 001 intentionally excludes patients, clinics, appointments, visits,
prescriptions, payments, dashboards, notifications, file uploads, and frontend
work.
