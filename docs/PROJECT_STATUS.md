# Project Status

_Last updated: 2026-10-30_

## Completed milestones

- _none yet_

## Current milestone

**Milestone 0 — Repository inspection & setup** — implemented, awaiting founder approval.

## Completed tasks (Milestone 0)

- [x] Environment inspected — see `docs/operations/DEV_ENVIRONMENT_ASSESSMENT.md`
- [x] Repository structure created (`apps/`, `workers/`, `packages/`, `infra/`, `scripts/`, `tests/`, `docs/`)
- [x] Root files: `README.md`, `.gitignore`, `.editorconfig`, `.env.example`, `CONTRIBUTING.md`, `Makefile`
- [x] Secrets and BIM data excluded from Git (`.gitignore`), verified by `make verify`
- [x] ADR process established (ADR-0001) and repository strategy recorded (ADR-0002)
- [x] Git initialized on `main` with an initial local commit

## Remaining tasks

- [ ] Founder decisions (see "Open questions")
- [ ] Push repository to GitHub (requires approval + repository to exist)
- [ ] Milestone 1 — development environment

## Feature status

| Feature | Status |
|---------|--------|
| Application code | Not started |

Status vocabulary: **Implemented & tested** · **Implemented, partially tested** · **Implemented, unverified** · **Not started**

## Known bugs

- _none_

## Technical debt

- _none_

## Decisions made

- [ADR-0001](decisions/0001-record-architecture-decisions.md) — Record architecture decisions
- [ADR-0002](decisions/0002-monorepo-modular-monolith.md) — Single repository, modular monolith

## Open questions

1. Final product name (affects repository name, package names, domain).
2. GitHub repository: name, private vs public (private recommended for a commercial product).
3. License: proprietary assumed — confirm.
4. Target customer region / data residency (e.g. Saudi Arabia, Egypt, EU) — affects hosting in Milestone 15.
5. MVP scope boundary: which milestones must be done before the first pilot customer?

## Next recommended task

Milestone 1 — development environment: scaffold `apps/api` (FastAPI + uv) and `apps/web`
(Next.js + pnpm) with pinned versions, Docker Compose for local services, `make` targets for
start/stop/migrate/test/lint/format/build, and CI running lint + type-check + tests.
