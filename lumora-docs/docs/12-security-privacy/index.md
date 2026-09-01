# Security & Privacy

## Purpose

This book defines Lumora Academy's security and privacy standards: authentication and authorization, data protection, secrets handling, abuse/injection defenses, and audit accountability. [Software Architecture](../07-software-architecture/index.md), [Database Architecture](../09-database-architecture/index.md), and [API Architecture](../10-api-architecture/index.md) each defer their security/privacy detail here — this is where it actually lives.

## Status

Version: 1.6 foundation draft. Establishes principles in each category below; the role/permission model, parent-child account model, data classification scheme, audit log access model, applicable regulation, and audit retention policy now all have proposed ADRs.

## Authentication & authorization

- Authentication uses Laravel Sanctum ([API Architecture](../10-api-architecture/index.md#authentication)); the cookie-vs-token decision is tracked there, not duplicated here.
- Roles and permissions are owned by the Identity & Access module ([Software Architecture](../07-software-architecture/index.md#primary-modules-working-draft)). Authorization is checked at the module boundary — a module verifies the caller's permission itself rather than trusting that the API layer already checked, so the same rule holds whether a call comes from the API, from Filament, or from another module.
- **Role set:** Student, Parent, Admin for Phase 1, Teacher added in Phase 3 — authorized via native Laravel Policies rather than a permission package, so Filament's admin authorization comes from the same mechanism ([ADR-0018](../21-adr/0018-native-policies-role-model.md)).

## Privacy & data protection

Directly from the [Constitution](../00-constitution/index.md#non-negotiable-principles) principle 5 (privacy is a product feature — minimal, purposeful, protected, explainable data collection) and principle 4 (child safety is mandatory):

- Personal data is minimized and owned by Identity & Access; other modules reference a person by ID rather than copying their personal fields ([Database Architecture](../09-database-architecture/index.md#privacy-and-child-safety-in-schema-design)).
- Parents and authorized staff must have appropriate visibility into a child's AI interactions ([AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md), requirement 6). [ADR-0019](../21-adr/0019-parent-initiated-child-accounts.md) proposes parent-initiated account creation with a many-to-many parent-student link table, so this requirement is satisfied structurally — no child account can exist without a linked, visible parent.
- **Data classification:** [ADR-0020](../21-adr/0020-four-tier-data-classification.md) proposes four tiers — Public, Internal, Personal, Sensitive/Child — with Sensitive/Child defined as a bright-line test (Personal *and* about a specific student), recorded via a migration-comment convention rather than new tooling.

## Secrets management

- Secrets (AI provider API keys, database credentials, storage keys) are environment configuration, never committed to a repository — already enforced in practice: the root `.gitignore` excludes environment files and local settings across the monorepo.
- No module reads a secret directly from another module's configuration; each integration (AI providers, storage, search) owns its own credential, consistent with the provider-abstraction principle in [AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md) (requirement 8).
- Secret storage/rotation mechanics (hosting-level secret manager, rotation cadence) belong to [Infrastructure & DevOps](../13-infrastructure-devops/index.md), not this book.

## Injection & abuse defenses

- Standard framework defenses are the baseline, not something to reinvent: parameterized queries via Eloquent, CSRF protection on cookie-authenticated flows, output escaping in both Filament and the Next.js portal.
- Rate limiting applies to authentication endpoints and to the AI Gateway specifically — the AI Gateway is a single choke point ([Software Architecture](../07-software-architecture/index.md#cross-cutting-principles)), which makes it both the right place to enforce abuse limits and the right place to defend against prompt injection.
- Unsafe AI output must be blocked, escalated, or redirected rather than returned to the user as-is ([AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md), requirement 7) — this is a security control, not just a content-quality one, and it lives in the AI Gateway alongside the audit logging [API Architecture](../10-api-architecture/index.md#the-ai-gateway-boundary) already requires.

## Audit & accountability

- Every AI Gateway request/response is logged for audit ([AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md), requirement 3; restated as an API requirement in [API Architecture](../10-api-architecture/index.md#the-ai-gateway-boundary)). [ADR-0021](../21-adr/0021-audit-log-access-model.md) decides who can read it — Admin fully, Parent scoped to their own linked student via [ADR-0019](../21-adr/0019-parent-initiated-child-accounts.md), Student not directly. Retention follows [ADR-0029](../21-adr/0029-malaysia-pdpa-applicable-regulation.md)'s purpose-based principle (retain while the account is active, purge within a bounded window after deletion) rather than a fixed period — PDPA itself doesn't specify one.
- Security-sensitive actions beyond AI interactions — role changes, data export, data deletion, admin overrides — should be logged with the same rigor, even though only the AI audit trail is currently a stated requirement.

## Applicable regulation

[ADR-0029](../21-adr/0029-malaysia-pdpa-applicable-regulation.md) confirms Malaysia's PDPA (2010, as amended 2024) as the applicable regime, given Lumora Academy's Malaysia-only target market — resolving what had been the single most consequential open item in this book, since it also unblocked audit and analytics retention. This isn't a substitute for formal legal counsel review before Phase 1 launch, and needs revisiting if the target market ever expands beyond Malaysia — see the ADR for both caveats.

## Scope boundaries

| Topic | Owned by |
|---|---|
| Module and data ownership these controls protect | [Software Architecture](../07-software-architecture/index.md), [Database Architecture](../09-database-architecture/index.md) |
| Where auth/authz and AI Gateway controls are enforced in the API | [API Architecture](../10-api-architecture/index.md) |
| How decisions here get ratified | [Development Standards](../08-development-standards/index.md) |
| Secret storage mechanics, network security, environment isolation | [Infrastructure & DevOps](../13-infrastructure-devops/index.md) |
| Underlying AI safety requirements this book operationalizes | [AI Development Bible](../06-ai-development-bible/index.md) |

## Related documents

- [Constitution](../00-constitution/index.md) — principles 4 and 5, the source of the child-safety and privacy requirements above.
- [AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md) — the AI-specific safety requirements this book enforces at the security layer.
- [Software Architecture](../07-software-architecture/index.md) / [Database Architecture](../09-database-architecture/index.md) / [API Architecture](../10-api-architecture/index.md) — where these controls are actually implemented.
