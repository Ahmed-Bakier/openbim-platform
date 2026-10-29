# workers — Background jobs

Entrypoints for asynchronous work that must not run inside HTTP requests:
IFC parsing and processing, BCF package import, notification delivery.

Workers import domain code from `apps/api` rather than duplicating it, so the system stays one
modular monolith with multiple process types (web API process + worker process).
The job framework (e.g. Celery, Dramatiq, or a PostgreSQL-backed queue) is chosen in
**Milestone 1/2** and recorded as an ADR.
