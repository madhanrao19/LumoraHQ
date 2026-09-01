# ADR 0025: Three Analytics Event Categories, Anonymized by Default; Retention Stays Open

## Status

Accepted

## Context

[Analytics & Data](../18-analytics-data/index.md) flagged event taxonomy and retention period as open, noting retention should be resolved "alongside [Security & Privacy](../12-security-privacy/index.md#applicable-regulation)'s 'applicable privacy regulation(s)' item, not as a separate decision." That split applies here the same way it did in [ADR-0021](0021-audit-log-access-model.md): event **taxonomy** is a technical/architecture decision this project can make now; retention **duration** is a legal question that stays open until the regulation is known.

## Decision

**Event taxonomy — three categories, not an exhaustive event list:**

1. **Feature Adoption** — which portal features and flows get used (e.g. "assessment started," "AI tutor session started"), occurrence and coarse metadata only.
2. **Learning Progress Aggregates** — cohort/aggregate completion and performance trends. **Not** per-student drill-down — that data already lives in the Lesson & Assessment Engine's own database tables ([Database Architecture](../09-database-architecture/index.md#schema-ownership)), not analytics.
3. **AI Feature Adoption** — engagement with AI features at the feature-usage level (a tutor session started, a lesson draft requested). The *content* or correctness of an AI interaction stays in the AI audit trail ([ADR-0021](0021-audit-log-access-model.md)), not analytics — analytics sees that a feature was used, never what was said.

**Default anonymization:** student-linked analytics events use a non-reversible-from-analytics-alone identifier by default, not the student's real database ID or other personal fields. Any analysis requiring an actual per-student view goes through the product's own database records — already access-controlled via [ADR-0018](0018-native-policies-role-model.md)'s Policies and classified per [ADR-0020](0020-four-tier-data-classification.md) — not through the PostHog analytics pipeline.

**Retention duration is explicitly not decided here** — the same reasoning as [ADR-0021](0021-audit-log-access-model.md): it depends on which privacy regulation applies, still open in [Security & Privacy](../12-security-privacy/index.md#applicable-regulation).

## Alternatives considered

- **Track everything** (comprehensive instrumentation, fine-grained UI interactions). Richer product insight, but works directly against the minimization principle already established ([Security & Privacy](../12-security-privacy/index.md#privacy-data-protection), [Analytics & Data](../18-analytics-data/index.md#privacy-first-analytics)) and enlarges what needs regulatory review once that question resolves.
- **Route per-student drill-down through PostHog itself** (store real student IDs in analytics events). A simpler single pipeline, but conflates two purposes with different access-control needs: aggregate product-usage insight (reasonable for broad internal access) versus per-student progress records (already Sensitive/Child, tightly scoped). Mixing them would either over-expose sensitive per-student data to whoever has analytics access, or under-power legitimate case-management needs.
- **Category-based taxonomy, default anonymization, retention deferred to the regulation decision (chosen).** Gives Phase 1/2 implementers real starting structure, makes the minimization principle an actual rule rather than an aspiration, and routes the two different needs to the two systems already built for them.

## Consequences

Positive:
- Minimization becomes a concrete default (anonymized unless specifically needed) instead of a stated aspiration.
- Clean separation between analytics (aggregate insight) and the already-existing per-student records/audit trail (individual accountability) avoids a real access-control conflation risk.
- Concrete categories to instrument against, without pre-specifying every event name.

Trade-offs:
- The product/growth team loses the convenience of one unified view combining usage and individual student detail — a deliberate trade favoring privacy minimization, consistent with the platform's stated priorities.
- Retention duration remains open, so the full analytics data-lifecycle policy isn't complete until the regulation question resolves.

## Review date

Revisit retention duration once [Security & Privacy](../12-security-privacy/index.md#applicable-regulation)'s applicable-regulation item resolves. Revisit the three categories themselves once real Phase 1/2 usage reveals they're too coarse for genuine product decisions — not before.
