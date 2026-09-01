# ADR 0001: Use Laravel, Filament, and PostgreSQL as the Foundation Stack

## Status

Accepted

## Context

Lumora Academy needs a practical stack that a small team can build quickly while remaining maintainable and future-ready.

## Decision

Use Laravel as the backend foundation, Filament for admin/content operations, and PostgreSQL as the primary database. This ADR decides the framework choice, not a pinned release — exact versions are tracked in [Technology Stack](../07-software-architecture/technology-stack.md) so this record doesn't go stale as Laravel/Filament/PostgreSQL ship new majors. *(Originally accepted when Laravel 12 was current; the version reference was removed from this line on 2026-09-01 for that reason, without reopening the framework decision itself.)*

## Consequences

Positive:
- Fast admin/content development.
- Strong ecosystem.
- Good fit for modular monolith architecture.
- PostgreSQL supports relational data and pgvector.

Trade-offs:
- Requires disciplined architecture to avoid a large tangled monolith.
- Next.js integration must be designed cleanly through APIs.

## Review date

Review when Lumora Academy reaches significant production traffic or a team structure that justifies service separation.
