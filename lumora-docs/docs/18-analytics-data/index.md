# Analytics & Data

## Purpose

This book defines product and learning analytics — distinct from the AI Gateway's audit logs ([AI Development Bible](../06-ai-development-bible/index.md), [Security & Privacy](../12-security-privacy/index.md)) and from error/performance monitoring ([Infrastructure & DevOps](../13-infrastructure-devops/index.md#observability-decided-tools-undecided-policy)). Those exist for safety accountability and operational health; this book exists for understanding usage and learning patterns.

## Status

Version: 1.1 foundation draft. Tooling is decided; event taxonomy and retention are not.

## Tooling

PostHog is the decided product analytics tool ([Technology Stack](../07-software-architecture/technology-stack.md)).

## Privacy-first analytics

Directly from the [Constitution](../00-constitution/index.md#non-negotiable-principles) principle 5 (privacy is a product feature) and [Security & Privacy](../12-security-privacy/index.md#privacy-data-protection)'s minimization rule: analytics events avoid unnecessary personal data, especially for child users. Where an insight doesn't require identifying a specific child, aggregate or anonymize rather than tracking at the individual level by default.

## Distinct from audit logs

Keep these separate in practice, not just in naming: AI Gateway audit logs exist for safety accountability and follow their own retention rules ([Security & Privacy](../12-security-privacy/index.md#audit-accountability)); product analytics exists to understand usage and learning patterns and shouldn't be conflated into the same store or retention policy.

## Not yet decided

- Event taxonomy (what gets tracked).
- Retention period for analytics data.
- Whether child usage analytics needs stricter handling than parent/admin usage analytics — this should be resolved alongside [Security & Privacy](../12-security-privacy/index.md#not-yet-decided)'s "applicable privacy regulation(s)" item, not as a separate decision.

## Scope boundaries

| Topic | Owned by |
|---|---|
| Privacy/minimization principle behind this book | [Security & Privacy](../12-security-privacy/index.md) |
| AI Gateway audit logs (different purpose) | [AI Development Bible](../06-ai-development-bible/index.md) |
| Error monitoring and tracing (different purpose) | [Infrastructure & DevOps](../13-infrastructure-devops/index.md) |

## Related documents

- [Technology Stack](../07-software-architecture/technology-stack.md) — PostHog, the decided tool.
- [Security & Privacy](../12-security-privacy/index.md) — the privacy principle this book applies.
