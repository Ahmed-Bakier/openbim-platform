# ADR-0001: Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-10-30
- **Deciders:** Founder, Claude (engineering partner)

## Context

This is a long-lived commercial product built incrementally. Technology and design choices
(viewer library, job framework, identity model, hosting) need to be traceable so that later
contributors understand *why* the system looks the way it does.

## Decision

Significant technical decisions are recorded as Architecture Decision Records in
`docs/decisions/`, numbered sequentially, using `0000-template.md`. Accepted ADRs are not
rewritten; they are superseded by new ADRs.

## Consequences

- Each milestone that makes a technology choice produces an ADR.
- `docs/PROJECT_STATUS.md` links to new ADRs under "Decisions made".
