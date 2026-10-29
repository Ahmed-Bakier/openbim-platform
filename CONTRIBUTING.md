# Contributing

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Always releasable. Protected; changes land via pull request. |
| `feature/<short-name>` | New functionality, e.g. `feature/issue-comments` |
| `fix/<short-name>` | Bug fixes |
| `docs/<short-name>` | Documentation-only changes |
| `chore/<short-name>` | Tooling, dependencies, CI |

A long-lived `develop` branch is **not** used unless a concrete release-management need appears.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <imperative summary, ≤ 72 chars>

<optional body: what and why, not how>
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `chore`, `ci`, `build`.
Scopes (examples): `api`, `web`, `worker`, `bcf`, `ifc`, `auth`, `infra`, `docs`.

Examples:

```
feat(bcf): import BCF 2.1 topics and comments
fix(auth): reject expired password-reset tokens
docs(adr): record background job framework decision
```

## Never commit

- Secrets, API keys, tokens, `.env` files with credentials.
- Customer / user BIM models (`.ifc`, `.rvt`, `.nwd`, ...) or BCF packages from real projects.
- Build artifacts, caches, `node_modules/`, virtual environments.

Only small, license-cleared test files are allowed under `tests/fixtures/` — record their
source and license in `tests/fixtures/README.md`.

## Before opening a pull request / finishing a milestone

1. `git status` — review every changed file.
2. `make format`, then `make check` — hygiene, lint, type-check, tests and build (same as CI).
3. Update the relevant docs and `docs/PROJECT_STATUS.md`.
4. Record significant technical decisions as an ADR in `docs/decisions/`.

## Architecture Decision Records

Copy `docs/decisions/0000-template.md` to the next number, e.g. `0004-background-jobs.md`.
ADRs are immutable once accepted; supersede them with a new ADR rather than rewriting history.
