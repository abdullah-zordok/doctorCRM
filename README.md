# Doctor Clinic Management System

Backend and frontend foundation for the Doctor Clinic Management System.

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

Frontend SPEC 01 application shell:

```bash
cd frontend
pnpm install
pnpm dev
pnpm typecheck
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

The frontend app runs on <http://localhost:5173> and expects the backend API on
<http://localhost:4000/api> by default.
