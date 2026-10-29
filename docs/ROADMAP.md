# Roadmap

Milestones are executed in order. Each one ends with its acceptance criteria verified,
documentation updated, and explicit founder approval before the next begins.

| # | Milestone | Outcome |
|---|-----------|---------|
| 0 | Repository inspection & setup | Structure, hygiene rules, docs skeleton, Git |
| 1 | Development environment | Web + API run locally; PostgreSQL, Redis (if chosen), S3 dev storage; scripts |
| 2 | Architecture & technical foundation | Modules, config, logging, errors, `/api/v1`, migrations, health checks, core schema |
| 3 | Authentication & multi-tenancy | Auth flows, orgs, memberships, RBAC, tenant isolation tests |
| 4 | Organizations & projects | Project CRUD, archiving, members, invitations, roles |
| 5 | Issue management core | Issues (UUID + `ISS-000001`), assignment, comments, attachments, history, list/search/filter |
| 6 | IFC model management | Upload, validation, object storage, versions, async processing |
| 7 | IFC viewer & element identity | Viewer PoC → selection, highlighting, properties, ID mapping |
| 8 | Issue-to-model integration | Viewpoints, snapshots, Go to Model / Viewpoint, select & zoom to element |
| 9 | BCF import/export | BCF 2.1 + 3.0, secure ZIP/XML handling, preview, lossy-conversion reporting |
| 10 | Centralized collaboration | Near-real-time updates, concurrency & conflict handling |
| 11 | UI/UX completion | Loading/empty/error states, accessibility, responsive layouts |
| 12 | Notifications & activity | In-app notifications, preferences, activity feeds |
| 13 | Security & reliability | Security review, rate limiting, backups, retries, idempotency, monitoring |
| 14 | Automated testing & QA | Full test pyramid, BCF interop tests, CI on every PR |
| 15 | Production deployment | Images, HTTPS, managed DB/storage, workers, CI/CD, backups |
| 16 | Production verification & launch | Smoke tests, user/admin docs, rollback plan, pilot checklist |

## Sequencing notes (recommendations, pending approval)

1. **Design the core schema in Milestone 2 with BCF in mind.** BCF topics, comments,
   viewpoints and component references map onto Issues, Comments, Viewpoints and Model
   Elements. Reading the BCF 2.1 / 3.0 schemas *before* the first migration avoids breaking
   schema changes in Milestone 9.
2. **Time-boxed viewer spike before Milestone 7.** The viewer library determines how camera
   state, element selection and identifiers are represented. A short proof of concept
   (comparing That Open Engine vs xeokit on one real IFC file) can run in parallel with
   Milestones 4–6 so Milestone 7 starts with a decided ADR.
3. **CI from Milestone 1**, not Milestone 14. Lint, type-check and test on every push from the
   start; Milestone 14 extends coverage rather than introducing CI.
