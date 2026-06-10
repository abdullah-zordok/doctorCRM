# Quickstart: Core Backend Foundation

## Prerequisites

- Docker Desktop or Docker Engine with Docker Compose.
- No local PostgreSQL installation is required.

## Environment Setup

1. Create `backend/.env` from `backend/.env.example`.
2. Set local development values:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://doctor_user:doctor_password@postgres:5432/doctor_db
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=7d
SEED_DOCTOR_EMAIL=doctor@example.com
SEED_DOCTOR_PASSWORD=ChangeMe123!
SEED_DOCTOR_NAME=Clinic Doctor
```

## Start the Project

```bash
docker compose up --build
```

Expected services:

- `postgres`
- `backend`

## Database Setup

Inside the backend service, run migrations and seed the initial Doctor account:

```bash
docker compose exec backend pnpm prisma migrate dev
docker compose exec backend pnpm prisma db seed
```

Re-running the seed command must leave exactly one active initial Doctor account.

## Verify Readiness

```bash
curl http://localhost:4000/api/health
```

Expected response shape:

```json
{
  "success": true,
  "message": "Service is ready",
  "data": {}
}
```

## Verify Doctor Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"doctor@example.com\",\"password\":\"ChangeMe123!\"}"
```

Expected result:

- `success` is `true`
- response includes `data.accessToken`
- response includes a safe user summary
- response does not include password fields

## Verify Protected Current User

```bash
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <accessToken>"
```

Expected result:

- valid token returns the current Doctor summary
- missing, expired, malformed, or tampered token returns a consistent
  unauthorized JSON response

## Verify Logout

```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Authorization: Bearer <accessToken>"
```

Expected result:

- logout returns a consistent success response
- the client discards the token after receiving success

## Out of Scope for This Spec

- Patient, clinic, appointment, visit, prescription, payment, dashboard,
  notification, file-upload, and frontend workflows.
