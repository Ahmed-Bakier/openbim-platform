# infra — Infrastructure

## Local development (`compose.yaml`)

| Service | Image | Port | Notes |
|---------|-------|------|-------|
| postgres | `postgres:17` | `127.0.0.1:5432` | Creates `$POSTGRES_DB` and `${POSTGRES_DB}_test` on first start |

Use from the repo root: `make db-up`, `make db-down`, `make db-logs`.
Data persists in the `openbim_postgres-data` Docker volume. To wipe the local database
completely (destructive): `docker compose --env-file .env -f infra/compose.yaml down -v`.

Redis and object storage are intentionally absent for now — see ADR-0003 and ADR-0004.

## Production

Dockerfiles, deployment configuration and backup automation arrive in Milestone 15.
No secrets are stored here.
