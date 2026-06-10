# Quickstart: Medical & Financial Workflow

## Prerequisites

- Spec 001 backend foundation is implemented.
- Spec 002 administrative workflow is implemented.
- Docker Desktop is running.

## Start the Stack

```powershell
docker compose up --build
```

Run migrations and seed data:

```powershell
docker compose exec backend pnpm prisma migrate deploy
docker compose exec backend pnpm prisma db seed
```

Verify the backend is ready:

```powershell
curl http://localhost:4000/api/health
```

## Validate the Workflow

Set a Doctor token after logging in:

```powershell
$doctorToken = "<doctor-jwt>"
$secretaryToken = "<secretary-jwt>"
$patientId = "<patient-id>"
$clinicId = "<clinic-id>"
```

Create a Visit:

```powershell
curl -X POST http://localhost:4000/api/patients/$patientId/visits `
  -H "Authorization: Bearer $doctorToken" `
  -H "Content-Type: application/json" `
  -d "{\"clinicId\":\"$clinicId\",\"diagnosis\":\"Acute bronchitis\",\"treatment\":\"Rest and medication\",\"visitDate\":\"2026-06-11T09:00:00.000Z\"}"
```

Create a Prescription:

```powershell
$visitId = "<visit-id>"

curl -X POST http://localhost:4000/api/visits/$visitId/prescriptions `
  -H "Authorization: Bearer $doctorToken" `
  -H "Content-Type: application/json" `
  -d '{"medications":[{"name":"Amoxicillin","dosage":"500mg","frequency":"3 times daily","duration":"7 days"}],"instructions":"Take after meals"}'
```

Generate Prescription PDF:

```powershell
$prescriptionId = "<prescription-id>"

curl -L http://localhost:4000/api/prescriptions/$prescriptionId/pdf `
  -H "Authorization: Bearer $doctorToken" `
  --output prescription.pdf
```

Register a Payment:

```powershell
curl -X POST http://localhost:4000/api/payments `
  -H "Authorization: Bearer $secretaryToken" `
  -H "Content-Type: application/json" `
  -d "{\"patientId\":\"$patientId\",\"visitId\":\"$visitId\",\"clinicId\":\"$clinicId\",\"totalAmount\":\"300.00\",\"paidAmount\":\"200.00\",\"method\":\"CASH\"}"
```

Verify invalid overpayment is rejected:

```powershell
curl -X POST http://localhost:4000/api/payments `
  -H "Authorization: Bearer $secretaryToken" `
  -H "Content-Type: application/json" `
  -d "{\"patientId\":\"$patientId\",\"clinicId\":\"$clinicId\",\"totalAmount\":\"100.00\",\"paidAmount\":\"150.00\",\"method\":\"CASH\"}"
```

View dashboards:

```powershell
curl http://localhost:4000/api/dashboard/doctor/summary `
  -H "Authorization: Bearer $doctorToken"

curl http://localhost:4000/api/dashboard/doctor/revenue `
  -H "Authorization: Bearer $doctorToken"

curl http://localhost:4000/api/dashboard/secretary/summary `
  -H "Authorization: Bearer $secretaryToken"
```

Verify detailed financial reports stay Doctor-only:

```powershell
curl http://localhost:4000/api/payments/reports/summary `
  -H "Authorization: Bearer $doctorToken"
```

## Scope Guardrails

This workflow must not add insurance, pharmacy integration, notifications, OCR,
file uploads, frontend screens, multi-doctor behavior, or SaaS tenancy.
