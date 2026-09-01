# ADR 0017: Single-Tenant Shared Schema; Defer Multi-Tenancy Pattern to Phase 3

## Status

Proposed

## Context

[Database Architecture](../09-database-architecture/index.md#privacy-and-child-safety-in-schema-design) flagged multi-tenancy (single vs. per-school schema) as open, tied to the [Roadmap](../25-roadmap/index.md) Phase 3 "School edition" item. Phase 1 and Phase 2 scope — individual student, parent, and admin accounts — has no multi-school concept at all; "School edition" is explicitly later, separate work.

## Decision

**Single-tenant, shared-schema database for Phase 1 and Phase 2.** No tenant/school partitioning is built into the schema now. When Phase 3's "School edition" work actually starts, the real multi-tenancy pattern (a `tenant_id`/`school_id` column with row-level filtering, schema-per-tenant, or database-per-tenant) gets chosen then, informed by real requirements gathered at that point — not guessed at now.

## Alternatives considered

- **Add a `tenant_id`/`school_id` column to every table now, even unused.** Looks like future-proofing, but adds a column and join/filter overhead to every query for a capability that's two phases away — and risks guessing wrong. If School edition's real requirements (e.g. data-residency or compliance needs specific to institutional customers) turn out to demand schema-per-tenant isolation instead, the row-level column approach would need to be unwound anyway. Same reasoning already applied against building a fourth environment tier before it's needed ([ADR-0008](0008-three-environment-topology.md)) or an i18n library before multi-language is scheduled ([ADR-0014](0014-english-only-launch-with-locale-route-scaffold.md)).
- **Schema-per-tenant or database-per-tenant from day one.** The strongest isolation, and the right call *if* school data-residency or compliance requirements demand it — but building that infrastructure before there's a single school customer is pure speculation with no requirements to build against.
- **Single-tenant shared schema now; decide the multi-tenancy pattern when Phase 3 requirements are real (chosen).** Matches actual current scope, and defers a genuinely hard schema decision until it can be informed by real requirements instead of a guess.

## Consequences

Positive:
- No wasted schema complexity for a capability that isn't scheduled yet.
- Phase 3 gets to choose the multi-tenancy pattern that actually fits real school data-isolation and compliance requirements, instead of retrofitting a Phase 1 guess that might be wrong.

Trade-offs:
- Retrofitting real multi-tenancy into a schema built single-tenant is genuine migration work when Phase 3 arrives — this is an accepted, deferred cost, not a free one. Phase 3 planning should budget real schema-migration time for this, not assume it's a configuration flag.

## Review date

Revisit when Phase 3 "School edition" work is actually scheduled — resolve the specific multi-tenancy pattern then, informed by real requirements gathered at that point.
