# Frontend Master Specification

## Doctor Clinic Management System

# Overview

This document defines the complete frontend vision for the Doctor Clinic Management System.

The application should provide a modern, premium, healthcare-oriented user experience that prioritizes speed, simplicity, and daily clinic operations.

The frontend should not resemble a generic admin template. Instead, it should feel like a commercial SaaS healthcare platform.

The overall layout and UX philosophy may take inspiration from professional medical dashboards such as PreClinic, while avoiding direct copying of components or pages.

The application is designed for a single-doctor clinic with one or more secretaries.

The frontend should remain scalable for future expansion without requiring architectural redesign.

---

# Frontend Goals

The frontend should prioritize:

* Simplicity
* Speed
* Clean design
* Minimal user interaction
* Fast navigation
* Operational efficiency
* Responsive behavior
* Reusable components
* Future scalability

Every screen should help the user complete tasks with the fewest possible clicks.

---

# User Roles

The system currently supports:

* Doctor
* Secretary

Each role should have its own dashboard and navigation while sharing the same design language and component system.

---

# Specification Structure

The frontend implementation is divided into two independent specifications.

---

# SPEC 01

# Frontend Foundation & Application Shell

## Objective

Build the complete application infrastructure and shared user interface system that all future pages will use.

This specification establishes the application's visual identity and navigation experience.

---

## Authentication

Implement a modern login experience.

Support role-based authentication.

Redirect users automatically according to their assigned role.

Doctor → Doctor Dashboard

Secretary → Secretary Dashboard

---

## Application Layout

Create a persistent application shell including:

* Left Sidebar
* Top Navigation Bar
* Main Content Area
* Notification Area
* User Menu
* Breadcrumb Navigation

The layout must remain consistent across every page.

---

## Navigation System

The sidebar should remain simple.

Avoid deeply nested menus.

The navigation should prioritize frequently used pages.

The user should never need more than two clicks to reach any major section.

---

## Shared UI Components

Build reusable components for:

* Buttons
* Cards
* Inputs
* Selects
* Tables
* Badges
* Modals
* Dialogs
* Dropdowns
* Tabs
* Tooltips
* Pagination
* Search Inputs
* Empty States
* Loading States
* Error States

Every component should be reusable across the project.

---

## Design System

Maintain a consistent design language.

Use:

* Soft colors
* Rounded corners
* Clear typography
* Minimal shadows
* Large spacing
* High readability

Avoid unnecessary decorations.

---

## Global Search

The application should support global patient search.

Search should be accessible from the top navigation.

Results should appear instantly.

---

## Notifications

Support notification components for:

* Success
* Error
* Warning
* Information

Notifications should never interrupt workflow.

---

## Responsiveness

Desktop is the primary target.

Tablet is secondary.

Mobile support should remain functional but is not the primary priority.

---

## Performance

Use lazy loading.

Optimize rendering.

Support server-side pagination.

Avoid blocking UI.

Prefer skeleton loading over spinners.

---

## Future Extensibility

The frontend architecture should support future modules:

* Multi Doctor
* Multi Branch
* Pharmacy
* Laboratory
* Radiology
* Insurance
* Billing
* Reports
* Analytics
* Notifications
* Multi Language

without redesigning the application shell.

---

# SPEC 02

# Clinic Workflow Experience

## Objective

Implement the entire operational experience of the clinic.

This specification focuses on daily workflows instead of analytics.

Every screen should optimize real clinic operations.

---

# Doctor Dashboard

The dashboard should prioritize:

* Waiting Patients
* Today's Visits
* Current Queue
* Recent Patients
* Upcoming Appointments

Business analytics should remain secondary.

The doctor should immediately know what requires attention.

---

# Secretary Dashboard

The secretary dashboard should prioritize:

* Today's Appointments
* Waiting Patients
* New Patients
* Completed Visits
* Quick Registration
* Quick Booking
* Patient Search

The secretary should perform daily tasks without unnecessary navigation.

---

# Patient Management

Provide:

* Patient List
* Patient Search
* Patient Profile
* Edit Patient
* Patient Timeline

Patient search should support:

* Name
* Phone Number
* Patient Code

Search should return results immediately.

---

# Patient Profile

The patient profile acts as the central information hub.

Organize information into sections:

* Basic Information
* Medical History
* Visit History
* Prescriptions
* Appointments
* Payments

Avoid long scrolling pages.

Navigation should remain intuitive.

---

# Visit Workflow

The consultation page should become the doctor's primary workspace.

Support:

* Chief Complaint
* Diagnosis
* Clinical Notes
* Prescription Builder
* Follow-up Notes

The doctor should complete the entire visit without leaving the page.

---

# Prescription Builder

Prescription creation should be fast.

Support adding multiple medicines.

Support dosage instructions.

Support duration.

Support notes.

Support PDF generation.

The experience should minimize typing.

---

# Appointment Management

Appointments should focus on today's schedule.

Waiting patients should always receive visual priority.

Completed appointments should automatically move lower.

Cancelled appointments should remain visible but visually distinct.

---

# Tables

All tables should support:

* Search
* Sorting
* Pagination
* Quick Actions

Actions should require minimal clicks.

---

# Forms

Forms should be simple.

Group related information.

Validate instantly.

Avoid unnecessary fields.

Reduce repetitive typing through smart defaults.

---

# Quick Actions

Common actions should always be accessible.

Examples:

* Add Patient
* Book Appointment
* Start Visit
* Finish Visit
* Generate Prescription
* Edit Patient

---

# Empty States

Empty pages should guide users.

Every empty state should contain a clear call-to-action.

Avoid blank screens.

---

# Loading Experience

Prefer skeleton loading.

Avoid blocking interfaces.

Navigation should remain responsive.

---

# Accessibility

Maintain:

* High contrast
* Readable typography
* Large click targets
* Consistent spacing
* Text labels alongside icons

Never rely on color alone.

---

# UX Philosophy

The interface should answer one question:

"What should the user do next?"

Current operational tasks should always be more visible than historical information.

Today's clinic activity should dominate the interface.

---

# Final Product Vision

The final frontend should resemble a premium healthcare SaaS product rather than a traditional admin dashboard.

The experience should feel calm, organized, professional, and optimized for real clinic operations.

Every design decision should prioritize usability over decoration.

Every interaction should reduce effort.

Every page should help doctors and secretaries complete their daily work faster and with fewer clicks.


---

# SPEC 03

# UI Kit Implementation Specification
# UI Kit Implementation Specification

## Overview

The project contains a complete UI reference kit located inside the following directory:

```text
UI_Kit/
```

The images inside this folder represent the target user experience, layout hierarchy, spacing, component organization, and visual flow for the application.

The implementation should follow these UI references as closely as possible while using reusable React components and modern frontend architecture.

Do **NOT** copy images pixel-by-pixel.

Instead, recreate the experience using clean, production-ready code.

---

# Implementation Rules

* Implement screens in the exact order listed below.
* Do not skip any screen.
* Finish each screen completely before starting the next one.
* Reuse components whenever possible.
* Follow the same spacing, layout hierarchy, and navigation structure across all screens.
* Use a shared design system for colors, typography, cards, buttons, inputs, tables, and forms.
* Keep the application responsive.
* Maintain visual consistency across the entire project.

---

# Screen Implementation Order

## Step 1

Read:

```text
UI_Kit/01-login.png
```

Implement:

* Login Page
* Authentication Layout
* Clinic Branding
* Login Form
* Remember Me
* Forgot Password
* Responsive Layout

Complete the page before continuing.

---

## Step 2

Read:

```text
UI_Kit/02-doctor-dashboard.png
```

Implement:

* Doctor Dashboard
* Statistics Cards
* Today's Queue
* Upcoming Appointments
* Recent Patients
* Daily Summary
* Quick Actions
* Sidebar Navigation
* Top Navigation

Reuse layout components from Login.

Complete the page before continuing.

---

## Step 3

Read:

```text
UI_Kit/03-secretary-dashboard.png
```

Implement:

* Secretary Dashboard
* Today's Schedule
* Quick Actions
* Queue Overview
* Recent Patients
* Dashboard Cards
* Navigation

Reuse existing dashboard components whenever possible.

Complete the page before continuing.

---

## Step 4

Read:

```text
UI_Kit/04-patients-list.png
```

Implement:

* Patients List
* Search Bar
* Filter
* Add Patient Button
* Data Table
* Pagination
* Actions Menu

Use reusable table components.

Complete the page before continuing.

---

## Step 5

Read:

```text
UI_Kit/05-patient-profile.png
```

Implement:

* Patient Header
* Overview Tab
* Medical History
* Visits
* Prescriptions
* Appointments
* Payments
* Timeline
* Information Cards

Use reusable card components.

Complete the page before continuing.

---

## Step 6

Read:

```text
UI_Kit/06-visit-screen.png
```

Implement:

* Visit Workspace
* Patient Information
* Consultation Form
* Diagnosis
* Clinical Notes
* Vital Signs
* Timeline
* Visit Information
* Quick Actions

Keep the doctor workflow on a single page.

Complete the page before continuing.

---

## Step 7

Read:

```text
UI_Kit/07-prescription-builder.png
```

Implement:

* Prescription Builder
* Medicine Search
* Medicine Table
* Dosage Controls
* Duration Controls
* Instructions
* Follow-up Section
* Prescription Summary
* Common Templates
* Quick Actions

Everything should be editable dynamically.

Complete the page before continuing.

---

## Step 8

Read:

```text
UI_Kit/08-appointments.png
```

Implement:

* Appointment Management
* Calendar Widget
* Appointment Table
* Filters
* Search
* Status Badges
* Appointment Summary
* Quick Actions

Reuse existing table components.

Complete the page before continuing.

---

## Step 9

Read:

```text
UI_Kit/09-settings.png
```

Implement:

* Settings Page
* Profile Settings
* Clinic Information
* General Settings
* Preferences
* Toggle Controls
* Save Changes
* Quick Links

Reuse existing form components.

Complete the page before continuing.

---

# Component Strategy

Never duplicate UI code.

Create reusable components for:

* Layout
* Sidebar
* Header
* Cards
* Tables
* Buttons
* Inputs
* Search Bars
* Filters
* Forms
* Dialogs
* Tabs
* Timeline
* Badges
* Status Chips
* Empty States
* Loading States

Every page should consume shared components.

---

# Tech Stack

Implement using:

* React
* TypeScript
* TailwindCSS
* shadcn/ui
* React Hook Form
* TanStack Table
* React Query
* Lucide Icons

Use best practices for scalability and maintainability.

---

# Final Goal

The final frontend should match the UI Kit as closely as possible while remaining fully component-based, responsive, maintainable, and production-ready.

The implementation should feel like a premium healthcare SaaS platform rather than a generic admin dashboard.
