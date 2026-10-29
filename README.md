# OpenBIM Issue Management & Collaboration Platform

> Working codename: `openbim-platform` (final product name TBD).

A SaaS platform for managing BIM issues based on the buildingSMART **BCF** standard:
create an issue once, manage it centrally, and make it accessible from every supported
BIM application (web viewer first; Revit / Navisworks connectors later).

**Status:** Milestone 1 — development environment. API and web app run locally with health checks; no product features yet.
See [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) for the live status and
[`docs/ROADMAP.md`](docs/ROADMAP.md) for the milestone plan.

---

## Repository layout

```
.
├── apps/
│   ├── web/              # Next.js + TypeScript frontend, incl. IFC web viewer   (Milestone 1+)
│   └── api/              # FastAPI modular monolith (Python)                      (Milestone 1+)
├── workers/              # Background job entrypoints (IFC processing, BCF import, notifications)
├── packages/             # Shared code across apps (e.g. generated TypeScript API client)
├── infra/                # Docker Compose (local dev), Dockerfiles, deployment config
├── scripts/              # Developer scripts (setup, verification, tooling)
├── tests/
│   ├── e2e/              # Cross-application end-to-end tests
│   └── fixtures/         # Small, license-cleared IFC and BCF test files
└── docs/                 # Product, architecture, BCF, security, testing, deployment docs + ADRs
```

Unit and integration tests live next to the code they test (`apps/api/tests`, `apps/web/...`).
The top-level `tests/` folder is only for cross-cutting tests and shared fixtures.

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Git | any recent | Version control |
| Node.js | 22 LTS (`.nvmrc`) | Frontend |
| pnpm | 10 (`corepack enable` picks the pinned version) | Frontend packages |
| Python | 3.13 (uv installs it automatically if missing) | Backend |
| uv | 0.11+ | Backend packages |
| Docker + Docker Compose | recent | Local PostgreSQL |
| make | any | Command shortcuts |

## Getting started

```bash
git clone https://github.com/Ahmed-Bakier/openbim-platform.git
cd openbim-platform
make setup      # creates .env from .env.example, installs backend + frontend dependencies
make db-up      # starts PostgreSQL 17 in Docker and waits until it is healthy
make migrate    # applies database migrations
```

Then, in two terminals:

```bash
make api        # http://localhost:8000  (API docs: http://localhost:8000/api/docs)
make web        # http://localhost:3000  (shows live API + database status)
```

Stop the API / web with `Ctrl+C`, and the database with `make db-down`.

## Everyday commands

| Command | What it does |
|---------|--------------|
| `make test` | All backend and frontend tests |
| `make lint` | Linters + formatting checks (no changes) |
| `make format` | Auto-format code |
| `make typecheck` | mypy strict + TypeScript |
| `make build` | Production artifacts (API wheel, Next.js build) |
| `make migration m="..."` | New Alembic migration from model changes |
| `make check` | Everything CI runs |
| `make help` | List all commands |

CI (`.github/workflows/ci.yml`) runs the same checks on every pull request and on `main`.

## Documentation

| Area | Location |
|------|----------|
| Project status | [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) |
| Roadmap | [`docs/ROADMAP.md`](docs/ROADMAP.md) |
| Architecture decisions (ADRs) | [`docs/decisions/`](docs/decisions/) |
| Contribution workflow | [`CONTRIBUTING.md`](CONTRIBUTING.md) |

## License

Proprietary — all rights reserved (pending confirmation). Do not distribute.
