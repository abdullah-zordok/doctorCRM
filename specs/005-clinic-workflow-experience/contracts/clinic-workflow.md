# Clinic Workflow UI Contract

## Purpose

Define the route, role, state, and interaction contracts for SPEC 02 clinic workflows.

## Route Contract

- `/doctor` shows the Doctor operational dashboard.
- `/secretary` shows the Secretary operational dashboard.
- `/patients` shows patient list, search, filters, and quick actions.
- `/patients/:patientId` shows patient profile sections and timeline.
- `/visits/:visitId` shows the doctor consultation workspace.
- `/visits/:visitId/prescriptions/new` shows the prescription builder.
- `/appointments` shows appointment management focused on today.

## Role Contract

- Doctor can access clinical visit workflow and prescription builder.
- Secretary can access appointment, registration, patient search, and permitted patient management workflows.
- Both roles can view permitted patient and appointment information.
- Role-restricted actions must be hidden or disabled with clear messaging.

## Dashboard Contract

- Doctor dashboard must prioritize waiting patients, today's visits, current queue, recent patients, and upcoming appointments.
- Secretary dashboard must prioritize today's appointments, waiting patients, new patients, completed visits, quick registration, quick booking, and patient search.
- Analytics must not dominate either dashboard.

## Patient Workflow Contract

- Patient search must accept name, phone number, and patient code.
- Patient profile must expose basic information, medical history, visits, prescriptions, appointments, payments, and timeline sections.
- Empty sections must show guided empty states instead of blank panels.

## Visit Workflow Contract

- The consultation workspace must keep patient context, chief complaint, diagnosis, clinical notes, follow-up notes, visit information, and quick actions on one page.
- The doctor must be able to finish the visit from the workspace.
- Loading and error states must not remove access to the surrounding application shell.

## Prescription Workflow Contract

- Prescription builder must support multiple editable medicine rows.
- Each medicine row must support dosage instructions and duration.
- The builder must support notes, summary review, and printable output generation.

## Appointment Workflow Contract

- Today's schedule is the primary appointment view.
- Waiting patients are visually prioritized.
- Completed appointments move lower but remain visible.
- Cancelled appointments remain visible and visually distinct.

## Table and Form Contract

- Workflow tables must support search, sorting, pagination, and quick actions where relevant.
- Forms must group related fields, validate immediately, and reduce repeated typing through sensible defaults.

## State Contract

- Loading states use skeletons.
- Empty states include a clear message and next action where relevant.
- Error states explain the issue and provide recovery where possible.
- Status must not rely on color alone.
