# Developer command shortcuts. Run `make help` to list targets.
# Targets are added only when they do real work (start/stop/migrate/test/lint/build arrive in Milestone 1).

.DEFAULT_GOAL := help
.PHONY: help verify

help: ## List available commands
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

verify: ## Check repository hygiene (structure, no secrets or BIM data tracked)
	@bash scripts/verify-repo.sh
