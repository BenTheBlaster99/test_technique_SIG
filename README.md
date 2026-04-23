# Candidate Management Dashboard

Vue 3 technical test implementation for a recruitment workflow. The app consumes the provided JSON Server API and focuses on a safe, complete core: list, filters, pagination, detail view, status update, and comment creation.

## Repository Structure
- `db.json`: provided mock database for JSON Server
- `app/`: Vue 3 + TypeScript application
- `TECHNICAL_DECISIONS.md`: technical documentation covering architecture choices, API handling, and difficulties encountered

## Live Demo
I chose to provide a deployed version of the project instead of recording a video demo.

- Frontend: `https://test-technique-sig.vercel.app`
- API (JSON Server): `https://test-technique-sig.onrender.com`

## Technical Documentation
The main technical documentation for this submission is available in `TECHNICAL_DECISIONS.md`.

It explains:
- architecture choices
- how the API is handled
- the main difficulties encountered during implementation

## Stack
- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- JSON Server

## Features Implemented
- Candidate list from the API
- Search input with debounce
- Status filter
- Position filter
- Applied-after date filter
- Pagination
- Dedicated candidate detail page
- Status update with `PATCH`
- Comment creation with `PATCH`
- Loading, empty, and error states
- Persisted filters

## Prerequisites
- Node.js 20+
- npm

## Install
From the repository root:

```bash
npm install
npm --prefix app install
```

## Run The API
```bash
npm run api
```

The API will be available at `http://localhost:3000`.

## Run The Vue App
In another terminal:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Run Both Together
```bash
npm run start
```

## Build
```bash
npm run build
```

## Type Check
```bash
npm run check
```

## API Notes
The frontend reads data from JSON Server only. No candidate data is hardcoded in the app.

Main endpoints used:
- `GET /candidatures`
- `GET /candidatures/:id`
- `PATCH /candidatures/:id`
- `GET /statuts`
- `GET /postes`

## Time Tracking
Realistic time spent on this submission:
- Reading and planning: 1 hour
- Project setup and architecture: 1 hour 15 minutes
- List page, filters, and pagination: 2 hours 15 minutes
- Detail page and update actions: 1 hour 20 minutes
- Documentation and cleanup: 40 minutes

Estimated total: 6 hours 30 minutes

## If I Had More Time
- Add focused unit tests around the stores and API layer
- Improve mutation feedback with toasts
- Add sorting controls beyond the default latest-first view
- Add a stronger accessibility pass for every interactive element
