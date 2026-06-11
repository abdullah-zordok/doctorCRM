# Quickstart: Frontend Foundation & Application Shell

## Prerequisites

- Node.js 20+
- pnpm
- Existing backend service available at `http://localhost:4000`

## Local Setup

```bash
cd frontend
pnpm install
pnpm dev
```

Open the frontend at:

```text
http://localhost:5173
```

## Full Stack Local Run

```bash
docker compose up --build
```

This starts:

- PostgreSQL
- Backend API on `http://localhost:4000`
- Frontend shell on `http://localhost:5173`

## Verification

```bash
cd frontend
pnpm typecheck
pnpm lint
pnpm build
```

## Notes

- Doctor and Secretary authentication uses the existing backend session flow.
- The shell contains placeholder routes for future workflow screens from later specs.
