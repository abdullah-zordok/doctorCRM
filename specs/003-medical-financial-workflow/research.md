# Research: Medical & Financial Workflow

## Decisions

### Medical Visit History

**Decision**: Store current visit fields on `Visit` and append every correction
to `VisitRevision`.

**Rationale**: Clinicians need the current view to be easy to read while the
system must preserve prior diagnoses and treatments for auditability.

**Alternatives Considered**: Updating the visit row in place was rejected
because it loses clinical history. Fully append-only visits were rejected
because common reads would become unnecessarily complex for the MVP.

### Prescription Corrections

**Decision**: Store the current prescription on `Prescription` and append
corrections to `PrescriptionRevision`.

**Rationale**: The system must reproduce the latest prescription PDF while still
retaining prior medication instructions after correction.

**Alternatives Considered**: Storing only generated PDF files was rejected
because PDFs must be reproducible from structured stored data.

### PDF Generation

**Decision**: Use PDFKit for server-side prescription PDF generation.

**Rationale**: The output is a structured document generated from stored data;
PDFKit keeps generation isolated and avoids a browser runtime dependency.

**Alternatives Considered**: Puppeteer was rejected for this MVP because it
requires a heavier browser dependency and is unnecessary for simple prescription
documents.

### Payment Corrections

**Decision**: Store current payment values on `Payment` and append corrections
to `PaymentRevision`.

**Rationale**: Staff need an accessible current balance, while financial
corrections must preserve the prior total, paid, remaining, method, and reason.

**Alternatives Considered**: Hard overwrites were rejected by the constitution.
Ledger-only accounting was rejected as too broad for this single-doctor MVP.

### Financial Amounts

**Decision**: Use decimal values for total, paid, and remaining amounts; compute
remaining as `total - paid`.

**Rationale**: Currency values must avoid floating-point rounding errors, and
the business rule requires paid amount to never exceed total amount.

**Alternatives Considered**: Integer cents were considered, but Prisma Decimal
aligns with the existing PostgreSQL and Prisma stack and keeps input/output
closer to business terminology.

### Dashboard Data

**Decision**: Dashboards are read-only service summaries over stored records and
are not stored as separate dashboard entities.

**Rationale**: Summaries must reflect current records and permissions. Persisted
dashboard snapshots are not required by the specification.

**Alternatives Considered**: Materialized summary tables were rejected for the
MVP because the expected data volume is small and freshness is more important.

### Secretary Financial Access

**Decision**: Secretaries can register/view payments and limited operational
summaries, but cannot access detailed revenue reports.

**Rationale**: This matches the role restrictions in the blueprint and spec,
while still allowing daily front-desk payment work.

**Alternatives Considered**: Allowing Secretaries to view all revenue reports
was rejected because detailed financial reporting is Doctor-only.
