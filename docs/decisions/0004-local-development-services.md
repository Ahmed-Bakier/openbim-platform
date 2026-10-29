# ADR-0004: Local development services and toolchain

- **Status:** Accepted
- **Date:** 2026-10-30
- **Deciders:** Founder, Claude (engineering partner)

## Context

Milestone 1 sets up the local environment. The master plan says to choose the smallest
reliable stack and not install every technology up front.

## Decision

**Runtimes and package managers**

| Area | Choice | Notes |
|------|--------|-------|
| Python | 3.13 (`apps/api/.python-version`) | Supported by all dependencies incl. IfcOpenShell 0.9 wheels |
| Python packaging | uv, lockfile `apps/api/uv.lock` | `uv sync --locked` in CI |
| Node.js | 22 LTS (`.nvmrc`) | Next.js 16 requires ≥ 20.9 |
| JS packaging | pnpm 10, lockfile `apps/web/pnpm-lock.yaml` | Version pinned via `packageManager` |
| Frontend | Next.js 16.4, React 19.3, Tailwind 4, TanStack Query 5, Zod 4 | TypeScript 5.9 and ESLint 9 kept at the versions Next.js scaffolds (TS 7 / ESLint 10 exist but are not yet the Next.js defaults) |
| Backend | FastAPI 0.162, Pydantic 2.14, SQLAlchemy 2.1, Alembic 1.20, psycopg 3.3 | |
| Quality | ruff, mypy `--strict`, pytest; ESLint, Prettier, `tsc`, Vitest | |

**Local services**

- **PostgreSQL 17** via `infra/compose.yaml` (also the CI service version). A separate
  `<db>_test` database is created automatically for integration tests.
- **No Redis** — not needed until a background job framework is chosen (ADR-0003).
- **No object storage service yet.** MinIO, the usual choice, is no longer viable: its
  community edition stopped publishing images/binaries in October 2025 and the repository was
  archived in April 2026. A replacement for local S3 (candidates: SeaweedFS, Garage, RustFS,
  S3Proxy) is chosen when attachments / IFC uploads begin (Milestone 5/6), together with the
  production object storage provider.

**Fonts**: system font stacks; no Google Fonts download at build or runtime (works offline and
in restricted networks, no third-party request from users' browsers).

## Consequences

- `make setup && make db-up && make migrate` is the full local bootstrap.
- Adding Redis or object storage later requires a new ADR and a Compose service.
