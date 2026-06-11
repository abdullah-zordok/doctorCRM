# Tasks: Frontend Foundation & Application Shell

**Input**: Design documents from `/specs/004-frontend-foundation-shell/`

**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Organization**: Tasks are grouped by user story to keep the frontend foundation independently implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`, `US4`)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the frontend workspace, build tooling, and runtime integration

- [X] T001 Create the frontend workspace scaffold and base directories in `frontend/src/components/ui/`, `frontend/src/features/auth/`, `frontend/src/features/notifications/`, `frontend/src/layout/`, `frontend/src/lib/`, `frontend/src/routes/`, `frontend/src/styles/`, and `frontend/src/types/`
- [X] T002 [P] Configure the frontend package scripts, dependencies, TypeScript settings, Vite config, Tailwind config, PostCSS config, and ESLint config in `frontend/package.json`, `frontend/tsconfig.json`, `frontend/tsconfig.node.json`, `frontend/vite.config.ts`, `frontend/tailwind.config.ts`, `frontend/postcss.config.js`, and `frontend/eslint.config.js`
- [X] T003 [P] Add the frontend entry shell, HTML host page, and browser environment typing in `frontend/index.html`, `frontend/src/main.tsx`, `frontend/src/styles/globals.css`, and `frontend/src/vite-env.d.ts`
- [X] T004 [P] Wire the frontend service into local runtime and developer documentation in `frontend/Dockerfile`, `docker-compose.yml`, `README.md`, and `frontend/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core frontend infrastructure that every user story depends on

**CRITICAL**: No user story work should begin until this phase is complete

- [X] T005 [P] Implement typed API transport, auth-aware request handling, and patient search helpers in `frontend/src/lib/api-client.ts`, `frontend/src/lib/storage.ts`, and `frontend/src/types/api.ts`
- [X] T006 [P] Implement session hydration, login/logout behavior, and role mapping in `frontend/src/features/auth/auth-provider.tsx` and `frontend/src/features/auth/auth-routes.tsx`
- [X] T007 [P] Implement the non-blocking notification context and toast host in `frontend/src/features/notifications/notifications-provider.tsx`
- [X] T008 [P] Establish the shared healthcare design system tokens and global style rules in `frontend/src/styles/globals.css` and `frontend/tailwind.config.ts`
- [X] T009 [P] Build the reusable UI primitives for buttons, cards, inputs, selects, badges, dialogs, dropdowns, tabs, tooltips, skeletons, empty states, error states, search inputs, pagination, and data tables in `frontend/src/components/ui/` and `frontend/src/lib/utils.ts`
- [X] T010 [P] Define the router skeleton, public login route, protected route guards, error fallback, and route-level placeholders in `frontend/src/routes/router.tsx` and `frontend/src/routes/error-page.tsx`
- [X] T011 [P] Add the role-aware shell navigation metadata and placeholder landing pages for protected areas in `frontend/src/layout/navigation.ts` and `frontend/src/routes/shell-pages.tsx`

**Checkpoint**: Foundation ready - user story implementation can now proceed

---

## Phase 3: User Story 1 - Role-Based Login (Priority: P1) MVP

**Goal**: Doctor and Secretary users can sign in, be validated, and reach the correct role-specific entry point

**Independent Test**: Sign in with valid Doctor and Secretary credentials and confirm each lands on the correct role route; submit invalid credentials and confirm the login page stays in place with a non-blocking error

- [X] T012 [P] [US1] Build the login page layout, form fields, and inline validation in `frontend/src/features/auth/login-page.tsx`
- [X] T013 [P] [US1] Connect login submission to the backend auth response, token persistence, and authenticated user state in `frontend/src/features/auth/auth-provider.tsx`, `frontend/src/lib/api-client.ts`, and `frontend/src/lib/storage.ts`
- [X] T014 [US1] Add role-based post-login redirects and unauthenticated fallbacks in `frontend/src/features/auth/auth-routes.tsx` and `frontend/src/routes/router.tsx`
- [X] T015 [P] [US1] Surface auth success and auth failure feedback without interrupting flow in `frontend/src/features/auth/login-page.tsx` and `frontend/src/features/notifications/notifications-provider.tsx`

**Checkpoint**: User Story 1 should be fully functional and independently demoable

---

## Phase 4: User Story 2 - Consistent Application Shell (Priority: P1)

**Goal**: Authenticated users get a persistent shell with sidebar navigation, breadcrumbs, top navigation, and user menu across protected pages

**Independent Test**: Open protected pages and confirm the shell remains consistent, the active section is visible, major sections are reachable in no more than two clicks, and the mobile drawer works without overlap

- [X] T016 [P] [US2] Build the persistent application shell container and protected content frame in `frontend/src/layout/app-shell.tsx`
- [X] T017 [P] [US2] Build the responsive role-aware sidebar with active states and mobile drawer behavior in `frontend/src/layout/sidebar.tsx`
- [X] T018 [P] [US2] Build the top navigation, breadcrumb trail, user menu, and mobile navigation trigger in `frontend/src/layout/top-nav.tsx` and `frontend/src/layout/breadcrumbs.tsx`
- [X] T019 [P] [US2] Connect route groups to the shell and role-specific landing routes in `frontend/src/routes/router.tsx` and `frontend/src/routes/shell-pages.tsx`
- [X] T020 [US2] Verify the shell remains stable across role changes, section changes, and viewport changes in `frontend/src/layout/sidebar.tsx`, `frontend/src/layout/top-nav.tsx`, and `frontend/src/routes/shell-pages.tsx`

**Checkpoint**: User Story 2 should be fully functional and independently demoable

---

## Phase 5: User Story 3 - Shared UI Foundation (Priority: P2)

**Goal**: Future clinic screens can reuse a consistent component system without duplicating interface code

**Independent Test**: Render the shared primitives in representative states and confirm the same visual language, spacing, and interaction states are used across components

- [X] T021 [P] [US3] Complete the core form and display primitives in `frontend/src/components/ui/button.tsx`, `frontend/src/components/ui/card.tsx`, `frontend/src/components/ui/input.tsx`, `frontend/src/components/ui/label.tsx`, `frontend/src/components/ui/badge.tsx`, `frontend/src/components/ui/select.tsx`, `frontend/src/components/ui/dialog.tsx`, `frontend/src/components/ui/dropdown-menu.tsx`, `frontend/src/components/ui/tabs.tsx`, and `frontend/src/components/ui/tooltip.tsx`
- [X] T022 [P] [US3] Complete the reusable state and data-display primitives in `frontend/src/components/ui/skeleton.tsx`, `frontend/src/components/ui/empty-state.tsx`, `frontend/src/components/ui/error-state.tsx`, `frontend/src/components/ui/search-input.tsx`, `frontend/src/components/ui/pagination.tsx`, and `frontend/src/components/ui/data-table.tsx`
- [X] T023 [US3] Confirm the shared design language is consistent across loading, empty, and error states in `frontend/src/styles/globals.css`, `frontend/tailwind.config.ts`, and `frontend/src/routes/shell-pages.tsx`

**Checkpoint**: User Story 3 should be reusable across future clinic screens

---

## Phase 6: User Story 4 - Global Search and Notifications (Priority: P2)

**Goal**: Clinic users can search for patients from the top navigation and receive non-blocking workflow feedback

**Independent Test**: Search for active patients from the top navigation and confirm results render inline; trigger success, error, warning, and info notifications and confirm they do not block navigation

- [X] T024 [P] [US4] Build inline global patient search with debounced lookup, loading state, empty state, and error state in `frontend/src/layout/global-search.tsx` and `frontend/src/lib/api-client.ts`
- [X] T025 [P] [US4] Integrate global search into the top navigation on desktop and mobile in `frontend/src/layout/top-nav.tsx`
- [X] T026 [P] [US4] Finalize the non-blocking notification types, stack behavior, and dismissal flow in `frontend/src/features/notifications/notifications-provider.tsx`
- [X] T027 [US4] Verify search and notification behavior remains usable on tablet and mobile viewports in `frontend/src/layout/global-search.tsx`, `frontend/src/layout/sidebar.tsx`, and `frontend/src/layout/top-nav.tsx`

**Checkpoint**: User Story 4 should be fully functional and independently demoable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and end-to-end verification across the frontend foundation

- [X] T028 [P] Update the frontend quickstart and runtime docs to match the delivered shell in `specs/004-frontend-foundation-shell/quickstart.md`, `README.md`, and `docker-compose.yml`
- [X] T029 [P] Run frontend typecheck, lint, and production build validation in `frontend/package.json` and confirm the app passes the documented commands from `specs/004-frontend-foundation-shell/quickstart.md`
- [ ] T030 [P] Perform browser smoke verification for login, shell navigation, global search, notifications, and responsive layout behavior against `frontend/`
- [X] T031 [P] Remove any temporary scaffolding or placeholder-only route content that should not remain after SPEC 01 in `frontend/src/routes/router.tsx` and `frontend/src/routes/shell-pages.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
  - User Story 1 and User Story 2 are both P1 and can proceed in priority order or with separate developers
  - User Story 3 and User Story 4 can proceed after the foundation is in place and should remain independently testable
- **Polish (Final Phase)**: Depends on the desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other user stories once the foundational auth/session work is complete
- **User Story 2 (P1)**: Can start after the foundational router and shell scaffolding are complete
- **User Story 3 (P2)**: Can start after the foundational component library and design system are complete
- **User Story 4 (P2)**: Can start after the foundational search/notification plumbing is complete and should integrate cleanly with the shell

### Within Each User Story

- Foundation tasks MUST be complete before user story tasks begin
- Role-based auth must be in place before shell routing can be validated
- Shell layout must exist before global search is integrated into the top navigation
- Shared primitives should be complete before future clinic pages consume them
- Story complete before moving to the next priority unless parallel staffing is available

### Parallel Opportunities

- Setup tasks T002-T004 can run in parallel after T001
- Foundational tasks T005-T011 can be split across separate files and worked on in parallel
- Within User Story 1, T012 and T015 can progress alongside T013 once the auth contracts are known
- Within User Story 2, T016-T019 are parallel-friendly across separate layout files
- Within User Story 3, T021 and T022 can be developed in parallel
- Within User Story 4, T024-T026 can be developed in parallel, with T027 as the final verification step

---

## Parallel Example: User Story 2

```bash
Task: "Build the persistent application shell container and protected content frame in frontend/src/layout/app-shell.tsx"
Task: "Build the responsive role-aware sidebar with active states and mobile drawer behavior in frontend/src/layout/sidebar.tsx"
Task: "Build the top navigation, breadcrumb trail, user menu, and mobile navigation trigger in frontend/src/layout/top-nav.tsx and frontend/src/layout/breadcrumbs.tsx"
Task: "Connect route groups to the shell and role-specific landing routes in frontend/src/routes/router.tsx and frontend/src/routes/shell-pages.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate login success, login failure, and role-based redirects
5. Demo the authenticated entry flow before expanding further

### Incremental Delivery

1. Complete Setup + Foundational phases
2. Deliver User Story 1 and validate authentication independently
3. Deliver User Story 2 and validate the shell independently
4. Deliver User Story 3 and validate the shared UI foundation independently
5. Deliver User Story 4 and validate search and notifications independently
6. Finish with polish and browser verification

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup and Foundational work together
2. Once the foundation is ready:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Integrate and verify the shell as each story completes

---

## Notes

- `[P]` tasks = different files, no dependencies
- `[Story]` label maps task to a specific user story for traceability
- Each user story should remain independently completable and testable
- Validate login, shell, search, and responsive behavior before considering SPEC 01 complete
- The frontend shell is the MVP boundary for this feature; SPEC 02 and SPEC 03 stay out of scope
