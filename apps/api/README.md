# apps/api — Backend API

FastAPI modular monolith (Python 3.13, Pydantic, SQLAlchemy 2, Alembic) on PostgreSQL.
Domain modules planned for Milestone 2+: `identity` (users, orgs, memberships), `projects`,
`issues`, `models` (IFC models, versions, elements), `bcf`, `viewpoints`, `activity`,
`notifications`.

## Commands

Run from the repository root (`make api`, `make test-api`, `make migrate`, ...) or here with uv:

| Command | What it does |
|---------|--------------|
| `uv sync` | Install dependencies into `.venv` from `uv.lock` |
| `uv run uvicorn --factory openbim_api.main:create_app --reload` | Dev server on http://localhost:8000 |
| `uv run pytest` | Tests (integration tests need `TEST_DATABASE_URL`, skipped otherwise) |
| `uv run ruff check . && uv run ruff format .` | Lint and format |
| `uv run mypy` | Strict type checking |
| `uv run alembic upgrade head` | Apply migrations |

## Endpoints

| Path | Purpose |
|------|---------|
| `GET /api/v1/health/live` | Process is up (no dependency checks) — for liveness probes |
| `GET /api/v1/health/ready` | Database reachable → `200`; otherwise `503` — for readiness probes |
| `GET /api/docs` | Interactive API docs (Swagger UI) |
| `GET /api/v1/openapi.json` | OpenAPI schema |

## Configuration

Read from environment variables and the repo-root `.env` (see `.env.example`):
`APP_ENV`, `LOG_LEVEL`, `DATABASE_URL` (required), `API_CORS_ORIGINS`.

## Layout

```
src/openbim_api/
├── main.py          # create_app() factory
├── core/            # config, database engine
└── api/v1/          # versioned HTTP routers
migrations/          # Alembic environment and versions
tests/
```
