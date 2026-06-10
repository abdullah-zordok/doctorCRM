<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Placeholder principles -> Backend-first, Dockerized, modular, secure clinic backend rules
Added sections:
- Technology and Data Rules
- Development Workflow
Removed sections:
- None
Templates requiring updates:
- ✅ updated: .specify/templates/plan-template.md
- ✅ updated: .specify/templates/spec-template.md
- ✅ updated: .specify/templates/tasks-template.md
- ✅ reviewed: .specify/templates/commands/*.md (directory not present)
- ✅ reviewed: AGENTS.md and Doctor_Clinic_Backend_Blueprint .md
Follow-up TODOs: None
-->

# Doctor Clinic Management System Backend Constitution

## Core Principles

### I. Backend-First Architecture
The system MUST be designed as a backend API first. Features MUST define API,
data, authentication, and operational behavior before any user interface work.
This keeps the clinic workflow reliable and reusable across future clients.

### II. Approved Stack and Docker Runtime
All implementation MUST use Node.js, TypeScript, Express.js, PostgreSQL, Prisma
ORM, JWT authentication, and Docker. The complete project MUST run through
Docker Compose, including application services, database, migrations, and local
development dependencies.

### III. Modular Service Architecture
Code MUST be organized by scalable domain modules. Controllers MUST stay thin:
HTTP parsing, auth context, validation handoff, and response mapping only.
Business rules, persistence orchestration, and cross-module decisions MUST live
inside services.

### IV. Secure Access and Input Discipline
Every protected endpoint MUST enforce JWT authentication and role-based access
control for Doctor and Secretary roles. Every request MUST be validated and
sanitized before service execution, with consistent JSON success and error
responses for all RESTful APIs.

### V. Historical Integrity and Clinical Outputs
Medical history, visits, prescriptions, payments, and financial records MUST NOT
be overwritten when facts change; use append-only records, status changes, or
versioned corrections. Prescription PDFs MUST be generated from stored
prescription data so outputs remain reproducible.

## Technology and Data Rules

Persistence MUST use PostgreSQL through Prisma models and migrations. Data
models MUST preserve auditability and remain easy to extend for future SaaS
support and multiple doctors without reworking core domains.

## Development Workflow

Plans and tasks MUST start from Docker, database, auth/RBAC, validation, module
boundaries, and REST contracts. New features MUST include service-level logic,
authorization checks, request validation, and tests for critical medical,
financial, and security behavior. Maintainability, simplicity, security, and
code quality take priority over delivery speed.

## Governance

This constitution supersedes conflicting specifications, plans, tasks, and
runtime guidance. Amendments require updating this file, reviewing dependent
templates, and recording a semantic version bump: MAJOR for incompatible
principle changes, MINOR for new or expanded principles, PATCH for
clarifications. Every feature plan MUST pass the Constitution Check before
design and before implementation.

**Version**: 1.0.0 | **Ratified**: 2026-06-10 | **Last Amended**: 2026-06-10
