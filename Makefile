# Developer command shortcuts. Run `make help` to list targets.
# Every target does real work; nothing here is a placeholder.

.DEFAULT_GOAL := help
SHELL := /bin/bash

API_DIR := apps/api
WEB_DIR := apps/web
COMPOSE := docker compose --env-file .env -f infra/compose.yaml

# Export variables from the repo-root .env (if present) into each recipe's environment.
LOAD_ENV := set -a; if [ -f .env ]; then . ./.env; fi; set +a;

.PHONY: help setup install db-up db-down db-logs api web migrate migration \
        test test-api test-web lint format typecheck build check verify

help: ## List available commands
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

# --- Setup -------------------------------------------------------------------

setup: ## First-time setup: create .env (if missing) and install dependencies
	@if [ ! -f .env ]; then cp .env.example .env && echo "Created .env from .env.example"; fi
	@$(MAKE) --no-print-directory install

install: ## Install backend (uv) and frontend (pnpm) dependencies from lockfiles
	cd $(API_DIR) && uv sync --locked
	cd $(WEB_DIR) && pnpm install --frozen-lockfile

# --- Local services ----------------------------------------------------------

db-up: ## Start local PostgreSQL (Docker) and wait until it is healthy
	$(COMPOSE) up -d --wait postgres

db-down: ## Stop local services (data is kept in the Docker volume)
	$(COMPOSE) down

db-logs: ## Follow local service logs
	$(COMPOSE) logs -f

# --- Run ---------------------------------------------------------------------

api: ## Run the API with auto-reload on http://localhost:8000 (docs: /api/docs)
	@$(LOAD_ENV) cd $(API_DIR) && uv run uvicorn --factory openbim_api.main:create_app --reload --port 8000

web: ## Run the web app with hot reload on http://localhost:3000
	@$(LOAD_ENV) cd $(WEB_DIR) && pnpm dev

# --- Database migrations -----------------------------------------------------

migrate: ## Apply all database migrations (alembic upgrade head)
	@$(LOAD_ENV) cd $(API_DIR) && uv run alembic upgrade head

migration: ## Create a migration from model changes: make migration m="add issues table"
	@test -n "$(m)" || (echo 'Usage: make migration m="describe the change"' && exit 1)
	@$(LOAD_ENV) cd $(API_DIR) && uv run alembic revision --autogenerate -m "$(m)"

# --- Quality -----------------------------------------------------------------

test: test-api test-web ## Run all tests

test-api: ## Backend tests (integration tests use TEST_DATABASE_URL)
	@$(LOAD_ENV) cd $(API_DIR) && uv run pytest

test-web: ## Frontend tests
	cd $(WEB_DIR) && pnpm test

lint: ## Lint and check formatting (no changes made)
	cd $(API_DIR) && uv run ruff check . && uv run ruff format --check .
	cd $(WEB_DIR) && pnpm lint && pnpm format:check

format: ## Auto-format and apply safe lint fixes
	cd $(API_DIR) && uv run ruff check --fix . && uv run ruff format .
	cd $(WEB_DIR) && pnpm format

typecheck: ## Strict type checking (mypy, tsc)
	cd $(API_DIR) && uv run mypy
	cd $(WEB_DIR) && pnpm typecheck

build: ## Build production artifacts (API wheel, Next.js build)
	cd $(API_DIR) && uv build --out-dir dist
	@$(LOAD_ENV) cd $(WEB_DIR) && pnpm build

verify: ## Check repository hygiene (structure, no secrets or BIM data tracked)
	@bash scripts/verify-repo.sh

check: verify lint typecheck test build ## Everything CI runs, in order
