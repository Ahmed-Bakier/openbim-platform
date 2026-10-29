# ADR-0003: Background job framework

- **Status:** Proposed — to be accepted (or revised) at the start of Milestone 6, before the first job is written
- **Date:** 2026-10-30
- **Deciders:** Founder, Claude (engineering partner)

## Context

Heavy work must not run inside HTTP requests: IFC parsing (seconds to many minutes for large
models), BCF package import, and notification delivery. Requirements:

- Long-running jobs (IFC processing) without broker visibility-timeout problems.
- Retries with backoff, and idempotent job design.
- Enqueue **in the same database transaction** as the record that triggers it (e.g. a
  `model_version` row with `status = pending`), so a job is never lost or run for a row that
  was rolled back.
- Small operational footprint: a two-person team, managed hosting, no Kubernetes.
- Python, works with SQLAlchemy and PostgreSQL.

No background job exists until Milestone 6, so **nothing is installed yet** — installing a
broker now would add a service with no consumer.

## Options considered (versions checked on PyPI, 2026-10-30)

| Option | Broker | Pros | Cons |
|--------|--------|------|------|
| **Procrastinate** 3.10 | PostgreSQL | No extra service; transactional enqueue; retries, scheduling, locks; job state queryable with SQL | Smaller community than Celery; queue throughput bounded by PostgreSQL (far above our needs) |
| **Dramatiq** 2.2 | Redis / RabbitMQ | Simple API, reliable acks, good retries | Extra service to run and pay for; enqueue is not transactional with our DB (needs an outbox) |
| **Celery** 5.6 | Redis / RabbitMQ | Most widely used, huge ecosystem | Heavier, more configuration; long tasks + Redis visibility timeout pitfalls; not transactional |
| **arq** 0.28 | Redis | Lightweight, asyncio-native | Small maintainer base; Redis required; not transactional |

## Proposed decision

**Procrastinate on PostgreSQL**, unless the Milestone 6 spike shows a blocker.

Reasons: it removes Redis from the stack entirely for now, and transactional enqueue directly
solves the "row committed but job lost" class of bugs that a Redis-based queue needs an outbox
pattern for. Our job volume (uploads and imports, not millions of events per minute) is well
within PostgreSQL's capacity.

## Consequences

- Local development and CI need only PostgreSQL until a real need for Redis appears.
- Real-time collaboration (Milestone 10) will evaluate PostgreSQL `LISTEN/NOTIFY` + SSE /
  WebSockets on its own merits; Redis can still be added then if justified.
- The Milestone 6 spike must verify: a multi-minute job, retry after worker crash, and
  transactional enqueue with our SQLAlchemy session setup.
