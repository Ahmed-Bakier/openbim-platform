# Development Environment Assessment

- **Date:** 2026-10-30
- **Environment:** Claude's cloud workspace (ephemeral Linux container), *not* the founder's machine.

## Findings

| Item | Result |
|------|--------|
| OS | Ubuntu 24.04.5 LTS, 2 vCPU, 7.8 GiB RAM |
| Existing project | None — no OpenBIM repository existed locally or among the founder's GitHub repos |
| Git | 2.43.0; no repository initialized before Milestone 0 |
| Node.js | v22.23.4 |
| pnpm / npm / yarn / bun | 10.28.0 / 10.9.9 / 1.22.22 / 1.4.4 |
| Python | 3.13.18 |
| uv / poetry | 0.11.32 / 2.4.3 |
| Docker / Compose | 29.9.2 / v5.6.1 — daemon starts, **but Docker Hub is unreachable** (network allowlist) |
| PostgreSQL | 16.15 installed natively (cluster stopped) |
| Redis | 7.0.15 installed natively |
| GitHub CLI | 2.89.0 |

## Implications

1. **Persistence:** this container is reclaimed after inactivity. The repository must be pushed
   to GitHub to survive; until then, work exists only here.
2. **Docker images cannot be pulled here.** Docker Compose files will still be written for the
   founder's machine and CI, but in this workspace services run natively (PostgreSQL 16, Redis 7).
   Production PostgreSQL version is chosen in Milestone 1/15; native 16 is acceptable for
   development verification, and CI will test against the pinned production version.
3. **Version verification:** current stable versions of Next.js, FastAPI, SQLAlchemy, etc. are
   checked against package registries at install time in Milestone 1.

## Milestone 1 notes

- Local verification in this workspace used native PostgreSQL 16 (`sudo pg_ctlcluster 16 main start`)
  with role `openbim` and databases `openbim` / `openbim_test`. Compose and CI use PostgreSQL 17.
- The `uv` warning about `UV_NATIVE_TLS` comes from this workspace's environment, not the project.
