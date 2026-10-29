# ADR-0002: Single repository, modular monolith

- **Status:** Accepted
- **Date:** 2026-10-30
- **Deciders:** Founder, Claude (engineering partner)

## Context

The product has a web frontend, a backend API, background workers, and — later — desktop
connectors (Revit, Navisworks). The team is small. The master plan explicitly asks for a
modular monolith and no premature microservices or Kubernetes.

## Options considered

1. **One repository (monorepo) with `apps/`, `workers/`, `packages/`** — atomic changes across
   API + frontend, one CI pipeline, shared fixtures and docs. Requires per-app tooling
   (pnpm for web, uv for Python) side by side.
2. **Separate repositories per app** — cleaner isolation, but cross-cutting changes (e.g. an API
   field + its UI) need coordinated PRs; overhead with no benefit at this team size.
3. **Microservices** — rejected: operational cost far exceeds MVP needs.

## Decision

- One Git repository.
- The backend is one deployable Python application (`apps/api`) organized into domain modules
  with explicit boundaries. Background workers run the **same codebase** as a separate process
  type (`workers/` holds entrypoints only).
- The frontend is one Next.js application (`apps/web`).
- Future desktop connectors (C#/.NET for Revit/Navisworks) are expected to live under `apps/`
  or `connectors/`; that decision is deferred until a connector milestone.

## Consequences

- One deploy unit for the backend, plus one worker process type → simple hosting.
- Module boundaries must be enforced by code review and import conventions, not network calls.
- If a module later needs independent scaling, it can be extracted because boundaries exist.
