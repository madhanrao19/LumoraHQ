# Analytics & Data

## Purpose

This book defines product and learning analytics — distinct from the AI Gateway's audit logs ([AI Development Bible](../06-ai-development-bible/index.md), [Security & Privacy](../12-security-privacy/index.md)) and from error/performance monitoring ([Infrastructure & DevOps](../13-infrastructure-devops/index.md#observability-decided-tools-undecided-policy)). Those exist for safety accountability and operational health; this book exists for understanding usage and learning patterns.

## Status

Version: 1.3 foundation draft. Tooling, event taxonomy, and retention now all have proposed ADRs or a resolved principle.

## Tooling

PostHog is the decided product analytics tool ([Technology Stack](../07-software-architecture/technology-stack.md)).

## Privacy-first analytics

Directly from the [Constitution](../00-constitution/index.md#non-negotiable-principles) principle 5 (privacy is a product feature) and [Security & Privacy](../12-security-privacy/index.md#privacy-data-protection)'s minimization rule: analytics events avoid unnecessary personal data, especially for child users. [ADR-0025](../21-adr/0025-analytics-event-categories-default-anonymized.md) makes this concrete — three event categories (Feature Adoption, Learning Progress Aggregates, AI Feature Adoption), with student-linked events anonymized by default; any real per-student view goes through the product's own database records instead, not analytics.

## Distinct from audit logs

Keep these separate in practice, not just in naming: AI Gateway audit logs exist for safety accountability and follow their own retention rules ([Security & Privacy](../12-security-privacy/index.md#audit-accountability)); product analytics exists to understand usage and learning patterns and shouldn't be conflated into the same store or retention policy.

## Retention and child-data handling

[ADR-0029](../21-adr/0029-malaysia-pdpa-applicable-regulation.md) confirms Malaysia's PDPA as the applicable regulation, resolving both remaining questions here:

- **Retention** follows PDPA's purpose-based Retention Principle — the same policy [ADR-0021](../21-adr/0021-audit-log-access-model.md) applies to audit logs — rather than a fixed period PDPA itself doesn't specify.
- **Child usage analytics does not need handling stricter than what's already decided.** PDPA has no COPPA/GDPR-style special provision for children's data, and this book's default-anonymization stance ([ADR-0025](../21-adr/0025-analytics-event-categories-default-anonymized.md)) already applies uniformly regardless of role — there's no additional child-specific rule PDPA requires on top of that.

## Scope boundaries

| Topic | Owned by |
|---|---|
| Privacy/minimization principle behind this book | [Security & Privacy](../12-security-privacy/index.md) |
| AI Gateway audit logs (different purpose) | [AI Development Bible](../06-ai-development-bible/index.md) |
| Error monitoring and tracing (different purpose) | [Infrastructure & DevOps](../13-infrastructure-devops/index.md) |

## Related documents

- [Technology Stack](../07-software-architecture/technology-stack.md) — PostHog, the decided tool.
- [Security & Privacy](../12-security-privacy/index.md) — the privacy principle this book applies.
