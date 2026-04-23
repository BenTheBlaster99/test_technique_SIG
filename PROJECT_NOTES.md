# Project Notes

## Plain-English Brief Summary
This technical test asks for a small Vue.js application for managing job candidates.

The company is not only checking whether the UI looks nice. They want to see whether the frontend is built like a real product feature:
- data must come from the provided JSON Server API
- state should be structured cleanly
- the user should be able to search, filter, paginate, and inspect one record in detail
- loading and error states must be visible
- technical choices must be documented

## Mandatory Features
- Use Vue 3
- Consume the provided `db.json` through JSON Server
- Fetch candidate data with HTTP requests
- Show a candidate list
- Show a candidate detail view
- Add search and filters
- Add pagination
- Use state management with Pinia or Vuex
- Handle loading states and network errors
- Document the approach in the repository

## Optional Extras
- Drag and drop
- Notifications
- Dark mode
- Animations
- Optimistic updates
- Advanced caching
- Unit tests

## Safe Scope Chosen For This Submission
We are prioritizing:
- list page
- dedicated detail page
- search
- status filter
- job filter
- applied-after filter
- pagination
- status update
- comment creation
- clear documentation

We are delaying advanced extras until the core experience is complete and stable.

## Why This Approach Makes Sense
- It covers the highest-value parts of the brief.
- It is realistic for the available time.
- It looks deliberate instead of overbuilt.
- It gives a strong explanation story for the interview.

## Build Checklist
- [x] Create the Vue 3 + TypeScript project
- [x] Add Router and Pinia
- [x] Create API services and shared types
- [x] Build the list view shell
- [x] Build the detail view shell
- [ ] Verify filtering, pagination, and update flows against JSON Server
- [ ] Finalize README and technical decisions note
- [ ] Run final checks before submission
