# Run The Doctor Clinic Project

## Requirements

- Docker Desktop with the Linux/WSL 2 engine running
- Docker Compose v2
- Ports `5173`, `4000`, and `5432` available

Node.js and pnpm are only required when running services without Docker.

## First-Time Startup

From the repository root:

```powershell
docker info
docker compose up --build -d
docker compose exec backend pnpm prisma migrate dev
docker compose exec backend pnpm prisma db seed
```

Open:

- Frontend: <http://localhost:5173>
- Backend readiness: <http://localhost:4000/api/health>

Default Doctor account:

```text
Email: doctor@example.com
Password: ChangeMe123!
```

Change the default password and JWT secret before using the project outside local development.

## Normal Startup

```powershell
docker compose up -d
docker compose ps
```

If dependencies, Dockerfiles, or lockfiles changed:

```powershell
docker compose up --build -d
```

## View Logs

```powershell
docker compose logs -f
```

Service-specific logs:

```powershell
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

## Database Commands

Apply development migrations:

```powershell
docker compose exec backend pnpm prisma migrate dev
```

Regenerate the Prisma client:

```powershell
docker compose exec backend pnpm prisma generate
```

Seed the default Doctor:

```powershell
docker compose exec backend pnpm prisma db seed
```

## Verification

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:4000/api/health
Invoke-WebRequest -UseBasicParsing http://localhost:5173/login
docker compose ps
```

Expected containers:

```text
doctor_postgres
doctor_backend
doctor_frontend
```

## Stop The Project

Stop containers while preserving database data:

```powershell
docker compose down
```

Remove containers and database data:

```powershell
docker compose down -v
```

The `-v` command permanently deletes the local PostgreSQL volume.

## Docker Desktop Troubleshooting On Windows

If Docker returns a `dockerDesktopLinuxEngine` error:

1. Quit Docker Desktop completely.
2. Open Docker Desktop as Administrator.
3. Confirm **Use the WSL 2 based engine** is enabled.
4. Wait until Docker Desktop reports that the engine is running.
5. Verify the engine before starting the project:

```powershell
wsl --list --verbose
docker context use desktop-linux
docker info
```

The `docker-desktop` WSL distribution should show `Running`. If Windows denies access to WSL or `com.docker.service`, restart Windows or ask an administrator to repair Docker Desktop.

## Run Without Docker

This project is designed for Docker Compose. For local-only execution, provide a PostgreSQL database first and create environment files:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Update `backend/.env` so `DATABASE_URL` points to the local PostgreSQL instance. Then run:

```powershell
Set-Location backend
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
```

In a second terminal:

```powershell
Set-Location frontend
pnpm install
pnpm dev
```

## Validation Commands

Backend:

```powershell
Set-Location backend
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Frontend:

```powershell
Set-Location frontend
pnpm typecheck
pnpm lint
pnpm build
```
