# Security & Privacy

## Purpose

This book defines Lumora Academy's security and privacy standards: authentication and authorization, data protection, secrets handling, abuse/injection defenses, and audit accountability. [Software Architecture](../07-software-architecture/index.md), [Database Architecture](../09-database-architecture/index.md), and [API Architecture](../10-api-architecture/index.md) each defer their security/privacy detail here — this is where it actually lives.

## Status

Version: 1.1 foundation draft. Establishes principles in each category below; several concrete policies are explicitly flagged as not yet decided rather than assumed — see [Not yet decided](#not-yet-decided).

## Authentication & authorization

- Authentication uses Laravel Sanctum ([API Architecture](../10-api-architecture/index.md#authentication)); the cookie-vs-token decision is tracked there, not duplicated here.
- Roles and permissions are owned by the Identity & Access module ([Software Architecture](../07-software-architecture/index.md#primary-modules-working-draft)). Authorization is checked at the module boundary — a module verifies the caller's permission itself rather than trusting that the API layer already checked, so the same rule holds whether a call comes from the API, from Filament, or from another module.
- The role set is not yet defined beyond what the Roadmap implies (student, parent, admin at minimum for Phase 1; teacher for Phase 3's "Teacher tools"). Define the actual role/permission model as an ADR before Phase 1 auth work starts.

## Privacy & data protection

Directly from the [Constitution](../00-constitution/index.md#non-negotiable-principles) principle 5 (privacy is a product feature — minimal, purposeful, protected, explainable data collection) and principle 4 (child safety is mandatory):

- Personal data is minimized and owned by Identity & Access; other modules reference a person by ID rather than copying their personal fields ([Database Architecture](../09-database-architecture/index.md#privacy-and-child-safety-in-schema-design)).
- Parents and authorized staff must have appropriate visibility into a child's AI interactions ([AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md), requirement 6). This is a real, already-decided requirement — it means the Identity & Access data model needs a parent-child account relationship, not just individual accounts. That relationship model itself is not yet designed (see below).
- A formal data classification scheme (e.g. which fields count as personal, which count as sensitive/child-related) does not exist yet. [Database Architecture](../09-database-architecture/index.md) flagged this as open; this book is where it should be defined once decided.

## Secrets management

- Secrets (AI provider API keys, database credentials, storage keys) are environment configuration, never committed to a repository — already enforced in practice: the root `.gitignore` excludes environment files and local settings across the monorepo.
- No module reads a secret directly from another module's configuration; each integration (AI providers, storage, search) owns its own credential, consistent with the provider-abstraction principle in [AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md) (requirement 8).
- Secret storage/rotation mechanics (hosting-level secret manager, rotation cadence) belong to [Infrastructure & DevOps](../13-infrastructure-devops/index.md), not this book.

## Injection & abuse defenses

- Standard framework defenses are the baseline, not something to reinvent: parameterized queries via Eloquent, CSRF protection on cookie-authenticated flows, output escaping in both Filament and the Next.js portal.
- Rate limiting applies to authentication endpoints and to the AI Gateway specifically — the AI Gateway is a single choke point ([Software Architecture](../07-software-architecture/index.md#cross-cutting-principles)), which makes it both the right place to enforce abuse limits and the right place to defend against prompt injection.
- Unsafe AI output must be blocked, escalated, or redirected rather than returned to the user as-is ([AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md), requirement 7) — this is a security control, not just a content-quality one, and it lives in the AI Gateway alongside the audit logging [API Architecture](../10-api-architecture/index.md#the-ai-gateway-boundary) already requires.

## Audit & accountability

- Every AI Gateway request/response is logged for audit ([AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md), requirement 3; restated as an API requirement in [API Architecture](../10-api-architecture/index.md#the-ai-gateway-boundary)). Who can read that log, and how long it's retained, is not yet decided.
- Security-sensitive actions beyond AI interactions — role changes, data export, data deletion, admin overrides — should be logged with the same rigor, even though only the AI audit trail is currently a stated requirement.

## Not yet decided

- **Applicable privacy regulation(s).** Lumora Academy handles children's data, references Malaysian curricula, and is hosted on Azure — which specific regulatory regime(s) apply (and therefore what consent, age-gating, and data-residency rules follow) has not been decided. This affects onboarding and consent flow design directly, so resolve it before Phase 1 authentication work, not after.
- **Data classification scheme** — which fields/tables count as personal vs. sensitive/child-related (referenced above and in Database Architecture).
- **Role/permission model** — the actual role set and what each role can do.
- **Parent-child account relationship model** — required by AI Safety Principles requirement 6, not yet designed.
- **Audit log access and retention policy** — who can read the AI audit trail and for how long.

Each of these should be resolved as an ADR, not decided implicitly in code — see [Development Standards](../08-development-standards/index.md#feature-workflow).

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
