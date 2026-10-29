# apps/api — Backend API

FastAPI modular monolith (Python, Pydantic, SQLAlchemy, Alembic) on PostgreSQL.
Domain modules planned: `identity` (users, orgs, memberships), `projects`, `issues`, `models`
(IFC models, versions, elements), `bcf` (import/export), `viewpoints`, `activity`, `notifications`.

Not yet initialized — scaffolded in **Milestone 1**; architecture foundation in **Milestone 2**.
Unit and integration tests will live in `apps/api/tests/`.
