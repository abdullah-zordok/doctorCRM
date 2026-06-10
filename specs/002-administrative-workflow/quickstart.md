# Quickstart: Administrative Workflow

## Prerequisites

- Spec 001 backend foundation is implemented.
- Docker Desktop is running.
- The project is started with Docker Compose from the repository root.

## Start the Stack

```powershell
docker compose up --build
```

Run migrations and seed data inside the backend container:

```powershell
docker compose exec backend pnpm prisma migrate deploy
docker compose exec backend pnpm prisma db seed
```

## Validate the Workflow

Set a Doctor token after logging in through the existing auth endpoint:

```powershell
$doctorToken = "<doctor-jwt>"
```

Create a Secretary:

```powershell
curl -X POST http://localhost:4000/api/users/secretaries `
  -H "Authorization: Bearer $doctorToken" `
  -H "Content-Type: application/json" `
  -d '{"email":"secretary@example.com","name":"Main Secretary","password":"StrongPass123"}'
```

Create a Clinic:

```powershell
curl -X POST http://localhost:4000/api/clinics `
  -H "Authorization: Bearer $doctorToken" `
  -H "Content-Type: application/json" `
  -d '{"name":"Main Clinic","phone":"+966500000000","address":"Riyadh"}'
```

Set a Secretary token after logging in as the created Secretary:

```powershell
$secretaryToken = "<secretary-jwt>"
$clinicId = "<clinic-id>"
```

Create a Patient:

```powershell
curl -X POST http://localhost:4000/api/patients `
  -H "Authorization: Bearer $secretaryToken" `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Ahmed Ali\",\"phone\":\"0500000000\",\"clinicId\":\"$clinicId\"}"
```

Search and paginate Patients:

```powershell
curl "http://localhost:4000/api/patients?search=Ahmed&page=1&pageSize=20&clinicId=$clinicId" `
  -H "Authorization: Bearer $secretaryToken"
```

Create an Appointment:

```powershell
$patientId = "<patient-id>"

curl -X POST http://localhost:4000/api/appointments `
  -H "Authorization: Bearer $secretaryToken" `
  -H "Content-Type: application/json" `
  -d "{\"patientId\":\"$patientId\",\"clinicId\":\"$clinicId\",\"scheduledAt\":\"2026-06-11T09:00:00.000Z\"}"
```

Cancel an Appointment without deleting it:

```powershell
$appointmentId = "<appointment-id>"

curl -X PATCH http://localhost:4000/api/appointments/$appointmentId/status `
  -H "Authorization: Bearer $secretaryToken" `
  -H "Content-Type: application/json" `
  -d '{"status":"CANCELLED"}'
```

Verify Secretary privilege restrictions:

```powershell
curl -X POST http://localhost:4000/api/users/secretaries `
  -H "Authorization: Bearer $secretaryToken" `
  -H "Content-Type: application/json" `
  -d '{"email":"doctor2@example.com","name":"Blocked Doctor","password":"StrongPass123","role":"DOCTOR"}'
```

Expected result: `403 Forbidden` or validation rejection; no Doctor account is
created.

## Scope Guardrails

This workflow must not create medical visits, diagnoses, prescriptions,
prescription PDFs, payments, dashboards, notifications, uploads, or frontend
screens.
