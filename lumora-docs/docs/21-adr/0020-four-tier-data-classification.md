# ADR 0020: Four-Tier Data Classification Scheme

## Status

Accepted

## Update (2026-09-04)

The applicable-regulation question this ADR's trade-offs deferred to has resolved: [ADR-0029](0029-malaysia-pdpa-applicable-regulation.md) confirms Malaysia's PDPA, and states directly that PDPA has no distinct children's-data provision beyond its general obligations — the existing child-safety design (this four-tier scheme included) already exceeds what PDPA itself requires. No additional tier or sub-category is needed on PDPA's account. As with ADR-0029 generally, this is a solid interim conclusion, not a substitute for real legal counsel confirming it before Phase 1 launch.

## Context

[Database Architecture](../09-database-architecture/index.md#privacy-and-child-safety-in-schema-design) and [Security & Privacy](../12-security-privacy/index.md#privacy-data-protection) both flagged a formal data classification scheme as open — informally referring to "personal vs. sensitive/child-related" without a decided, checkable definition. [ADR-0019](0019-parent-initiated-child-accounts.md) now gives this a concrete data model to classify against (parent and student accounts, a parent-student link table), rather than an abstract problem.

## Decision

**A four-tier classification**, decidable by a bright-line test rather than judgment calls:

| Tier | Definition | Example |
|---|---|---|
| Public | No restriction — fine to expose to anyone | Published curriculum content |
| Internal | Not for public exposure, but not personal | System configuration, aggregate stats |
| Personal | Identifies a specific person, any role | Name, email, account data |
| Sensitive/Child | Personal **and** about a specific student | Assessment scores, AI tutor conversation content, a parent-student link |

The test for **Sensitive/Child** is a strict conjunction, not a vibe: a field is Sensitive/Child only if it's both Personal *and* specifically about a student — this keeps the classification checkable rather than "anything that feels child-adjacent."

**Classification is recorded as a convention, not new tooling.** Each migration that adds or changes a table includes a comment noting its tier (or per-column tiers, for mixed tables), reviewed in code review the same way module-boundary compliance already is ([Development Standards](../08-development-standards/index.md#enforcing-module-boundaries-in-code)) — no automated scanner is built for this.

This ADR defines the **scheme** only. Classifying actual tables happens as they're built in Phase 1, not enumerated speculatively here.

## Alternatives considered

- **A finer-grained enterprise taxonomy** (six-plus tiers, regulation-specific sub-categories). More precise, but [Security & Privacy](../12-security-privacy/index.md#applicable-regulation)'s "applicable privacy regulation(s)" item is still open — building a compliance-grade taxonomy now means guessing at requirements a still-undecided legal question will actually set. A simple scheme is enough to shape the schema and access rules today, and can be refined once the regulation is known.
- **Automated column-level classification tooling** (a static scanner enforcing tags). Real tooling exists for this at scale, but is overkill for a solo/small team with no tables built yet — the same "don't add tooling before it's justified" reasoning already applied in [ADR-0015](0015-prompts-as-version-controlled-code.md) and [ADR-0018](0018-native-policies-role-model.md).
- **Four-tier scheme, code-review-enforced convention (chosen).** Decidable now, cheap to apply, and defers regulation-specific refinement to when that's actually known.

## Consequences

Positive:
- Gives Phase 1 implementers a real, simple rule to classify new tables/columns against, rather than an empty slate.
- A bright-line test ("Personal *and* about a student") instead of a fuzzy judgment call.
- Costs nothing to adopt — a naming/commenting convention, not new tooling.

Trade-offs:
- Once the applicable privacy regulation is decided, this scheme may need additional tiers or sub-categories a specific regime requires (e.g. a distinct category some regimes single out for health or biometric data) — this is a starting scheme, not guaranteed to be final.
- Enforcement relies on reviewer discipline in code review, with no automated check — the same accepted trade-off already made for module boundaries in [ADR-0018](0018-native-policies-role-model.md) and [Development Standards](../08-development-standards/index.md#enforcing-module-boundaries-in-code).

## Review date

Resolved — see Update above. Revisit only if Lumora's target market ever expands beyond Malaysia (the same trigger [ADR-0029](0029-malaysia-pdpa-applicable-regulation.md) itself names), since a new regime could require tiers this scheme doesn't anticipate.
