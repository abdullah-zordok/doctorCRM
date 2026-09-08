# Doctor Clinic Management System

Backend and frontend foundation for the Doctor Clinic Management System.

For complete startup, migration, verification, troubleshooting, and shutdown
steps, see [RUN_PROJECT.md](RUN_PROJECT.md).

## Spec 001: Core Backend Foundation

The current implementation covers lightweight SQLite (`dev.db`) database,
Prisma 6, LibSQL/Turso compatibility for Vercel, Doctor & Secretary
RBAC foundations, rich clinical seed data, JWT authentication,
request validation, consistent JSON responses, global error handling, and readiness checks.

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

Push schema and seed the initial dataset inside the backend service:

```bash
docker compose exec backend pnpm prisma db push
docker compose exec backend pnpm seed
```

The frontend app runs on <http://localhost:5173> and expects the backend API on
<http://localhost:4000/api> by default.
