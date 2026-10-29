# OpenBIM Issue Management & Collaboration Platform

> Working codename: `openbim-platform` (final product name TBD).

A SaaS platform for managing BIM issues based on the buildingSMART **BCF** standard:
create an issue once, manage it centrally, and make it accessible from every supported
BIM application (web viewer first; Revit / Navisworks connectors later).

**Status:** Milestone 0 — repository setup. No application code yet.
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

Exact versions are pinned in Milestone 1. Currently expected:

| Tool | Purpose |
|------|---------|
| Git | Version control |
| Node.js (LTS) + pnpm | Frontend |
| Python 3.12+ + uv | Backend and workers |
| Docker + Docker Compose | Local PostgreSQL, Redis, object storage |
| make | Developer command shortcuts |

## Getting started

```bash
git clone <repo-url> openbim-platform
cd openbim-platform
cp .env.example .env      # local-dev placeholders only; never commit .env
make verify               # checks repository hygiene (structure, no secrets tracked)
```

Commands for starting services, migrations, tests, linting and builds are added in
Milestone 1 and documented here. Run `make help` to list available commands.

## Documentation

| Area | Location |
|------|----------|
| Project status | [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) |
| Roadmap | [`docs/ROADMAP.md`](docs/ROADMAP.md) |
| Architecture decisions (ADRs) | [`docs/decisions/`](docs/decisions/) |
| Contribution workflow | [`CONTRIBUTING.md`](CONTRIBUTING.md) |

## License

Proprietary — all rights reserved (pending confirmation). Do not distribute.
