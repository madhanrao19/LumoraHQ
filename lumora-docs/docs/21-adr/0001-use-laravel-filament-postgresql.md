# ADR 0001: Use Laravel, Filament, and PostgreSQL as the Foundation Stack

## Status

Accepted

## Context

Lumora Academy needs a practical stack that a small team can build quickly while remaining maintainable and future-ready.

## Decision

Use Laravel 12 as the backend foundation, Filament for admin/content operations, and PostgreSQL as the primary database.

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
