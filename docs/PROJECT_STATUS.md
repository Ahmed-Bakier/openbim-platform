# Project Status

_Last updated: 2026-10-30_

## Completed milestones

- **Milestone 0 — Repository inspection & setup** (approved; pushed to `main` as `5278fe3`)

## Current milestone

**Milestone 1 — Development environment** — implemented on branch
`feature/m1-dev-environment`, awaiting founder approval and a first CI run on GitHub.

## Completed tasks (Milestone 1)

- [x] Current stable versions verified on PyPI / npm (see ADR-0004)
- [x] `apps/api`: FastAPI app factory, settings from env/`.env`, `/api/v1/health/live` and
      `/api/v1/health/ready` (real database check, `503` when unreachable), CORS, OpenAPI under `/api/v1`
- [x] Alembic configured (reads `DATABASE_URL` from settings); `upgrade head` and `alembic check` pass
- [x] Backend quality: ruff (lint + format), mypy `--strict`, pytest with real-PostgreSQL integration tests
- [x] `apps/web`: Next.js 16.4 + Tailwind 4 + TanStack Query; home page shows live API and database status
- [x] Frontend quality: ESLint (0 warnings), Prettier, `tsc`, Vitest + Testing Library
- [x] `infra/compose.yaml`: PostgreSQL 17 with healthcheck and automatic test database
- [x] `Makefile`: setup, install, db-up/down/logs, api, web, migrate, migration, test, lint, format, typecheck, build, verify, check
- [x] CI workflow `.github/workflows/ci.yml` (hygiene, API, web jobs) — validated with actionlint
- [x] ADR-0003 (background jobs, **proposed**) and ADR-0004 (local services & toolchain, accepted)

## Verification evidence (Claude's workspace, 2026-10-30)

| Check | Result |
|-------|--------|
| `make check` (verify, lint, typecheck, test, build) | Pass |
| Backend tests | 7 passed (incl. integration test against real PostgreSQL) |
| Frontend tests | 8 passed |
| API against real DB | `/health/ready` → 200; DB stopped → 503 without leaking connection details; DB restarted → 200 |
| Browser end-to-end | Production web build in headless Chromium shows "Backend API: Online" / "Database: Connected"; no console errors (confirms CORS) |
| `alembic upgrade head` / `alembic check` | Pass |
| `docker compose config` | Valid |

## Not yet verified

- `make db-up` with Docker: Docker Hub is unreachable from Claude's workspace, so the Compose
  PostgreSQL service was validated (`docker compose config`) but not started. Locally,
  PostgreSQL 16 ran natively instead. **Needs one run on the founder's machine.**
- CI on GitHub Actions: not run yet (branch not pushed).

## Feature status

| Feature | Status |
|---------|--------|
| Health checks (API) | Implemented & tested |
| System status page (web) | Implemented & tested |
| Product features | Not started |

Status vocabulary: **Implemented & tested** · **Implemented, partially tested** · **Implemented, unverified** · **Not started**

## Known bugs

- _none_

## Technical debt

- `NEXT_PUBLIC_API_BASE_URL` is baked in at build time. Before authentication (Milestone 3),
  decide whether the browser talks to the API cross-origin or through a same-origin proxy
  (affects cookies, CSRF and Docker image portability).
- Logging is plain `logging.basicConfig`; structured logging arrives in Milestone 2.

## Decisions made

- [ADR-0001](decisions/0001-record-architecture-decisions.md) — Record architecture decisions
- [ADR-0002](decisions/0002-monorepo-modular-monolith.md) — Single repository, modular monolith
- [ADR-0003](decisions/0003-background-jobs.md) — Background jobs: Procrastinate on PostgreSQL (**proposed**)
- [ADR-0004](decisions/0004-local-development-services.md) — Local development services and toolchain

## Open questions

1. Final product name (working codename `openbim-platform`).
2. GitHub repository visibility — currently **public**; private recommended.
3. Target customer region / data residency — affects hosting (Milestone 15).
4. MVP scope boundary: which milestones must be done before the first pilot customer?

## Next recommended task

Milestone 2 — architecture & technical foundation: domain module layout, structured logging,
error-handling conventions, sync vs async database access (ADR), and the first migration with
the core schema (users, organizations, memberships, projects, models, model versions,
elements, issues, assignments, comments, attachments, viewpoints, activity logs), designed
against the BCF 2.1 / 3.0 schemas.
