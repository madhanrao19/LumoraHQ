# Infrastructure & DevOps

## Purpose

This book defines hosting, environments, CI/CD, secret storage mechanics, backups, and observability operations for Lumora Academy — the operational detail that [Software Architecture](../07-software-architecture/index.md), [Database Architecture](../09-database-architecture/index.md), [Development Standards](../08-development-standards/index.md), [Security & Privacy](../12-security-privacy/index.md), and [Testing & QA](../14-testing-qa/index.md) all defer here.

## Status

Version: 1.1 foundation draft. Hosting, CDN, and observability *tools* are already decided ([Technology Stack](../07-software-architecture/technology-stack.md)); environment topology, CI/CD pipeline, secret manager, and backup policy are not — flagged explicitly below rather than assumed.

## Hosting & CDN (decided)

- **Hosting:** Azure. **CDN:** Cloudflare.
- Per the [Constitution](../00-constitution/index.md#non-negotiable-principles) principle 10 (minimize vendor lock-in): prefer standard, portable services within Azure over Azure-proprietary APIs where a practical choice exists. Managed PostgreSQL/Redis are fine — they're still the standard protocol underneath, so the application isn't locked to Azure's implementation. Exactly which Azure compute model (App Service, Container Apps, AKS, etc.) is not yet chosen.

## CI/CD

GitHub Actions is already in use in this monorepo — `.github/workflows/docs.yml` builds and strict-checks the docs site on every push/PR to `main`. That's a working precedent, not yet a formal decision for application code:

!!! note "Not yet decided"
    Whether `lumora-api`/`lumora-academy` CI reuses GitHub Actions (the existing precedent) or something else, and whether CI **blocks** merges on failing tests versus only reporting status ([Testing & QA](../14-testing-qa/index.md#release-readiness) defers this exact question here). Decide before Phase 1 code lands, since retrofitting a blocking gate after merges have been happening unguarded is disruptive.

## Environments

Not yet decided: how many environments exist (e.g. local/staging/production), how code is promoted between them, and what differs between them (data, secrets, AI provider usage — e.g. should staging hit real AI providers or a stub). This is fully open and should be resolved via ADR before the first deployable Phase 1 feature exists, since [API Architecture](../10-api-architecture/index.md) and [AI Development Bible](../06-ai-development-bible/index.md) both assume *some* non-production environment exists to test against.

## Secrets

[Security & Privacy](../12-security-privacy/index.md#secrets-management) already states the principle — secrets are environment configuration, never committed. This book owns the mechanism: **Azure Key Vault** is the proposed secret manager for all environments ([ADR-0007](../21-adr/0007-azure-key-vault-secret-manager.md), pending acceptance).

## Backups & disaster recovery

Not yet decided in detail, but scope is already narrower than it looks, per [Database Architecture](../09-database-architecture/index.md#data-stores-and-their-roles):

- **PostgreSQL is the only store that needs a real backup/DR policy** — it's the sole source of truth.
- Redis (cache/queue) and Meilisearch (derived search index) are explicitly disposable/reconstructable — they don't need backup, only a rebuild path.
- S3-compatible storage (files/media) needs its own retention policy, since it holds content PostgreSQL only references by key, not the content itself.

Backup frequency, retention window, and DR recovery-time targets are not yet decided.

## Observability (decided tools, undecided policy)

Tools are already chosen ([Technology Stack](../07-software-architecture/technology-stack.md)):

| Tool | Role |
|---|---|
| Sentry | Error monitoring |
| PostHog | Product analytics |
| OpenTelemetry | Distributed tracing |

Alerting thresholds, on-call process, and dashboard ownership are not yet decided — this book should define them once Phase 1 gives something worth alerting on.

## Realtime infrastructure

Laravel Reverb is used "where appropriate," not by default ([Software Architecture](../07-software-architecture/index.md#architecture-style)). Infrastructure should provision WebSocket support only for the features that actually need it (e.g. live notifications), not as a blanket requirement for every deployment.

## Not yet decided (summary)

- Azure compute model (App Service vs. Container Apps vs. AKS).
- Application CI/CD pipeline and whether it blocks merges.
- Environment topology (count, promotion flow, what differs per environment).
- Backup frequency, retention, and DR targets for PostgreSQL and S3-compatible storage.
- Alerting/on-call policy for Sentry/OpenTelemetry signals.

Each belongs in an ADR when decided, per the [Development Standards](../08-development-standards/index.md#feature-workflow) feature workflow — not settled implicitly by whatever the first deploy happens to do.

## Scope boundaries

| Topic | Owned by |
|---|---|
| System/module structure this infrastructure runs | [Software Architecture](../07-software-architecture/index.md) |
| Why PostgreSQL backup dominates this book's DR scope | [Database Architecture](../09-database-architecture/index.md) |
| Secrets principle (mechanism lives here, principle lives there) | [Security & Privacy](../12-security-privacy/index.md) |
| CI test-gating requirements this pipeline must satisfy | [Testing & QA](../14-testing-qa/index.md) |
| How infra decisions get ratified | [Development Standards](../08-development-standards/index.md) |

## Related documents

- [Technology Stack](../07-software-architecture/technology-stack.md) — the hosting/CDN/observability tools already decided.
- [ADR-0001](../21-adr/0001-use-laravel-filament-postgresql.md) — the stack decision this infrastructure serves.
- [Roadmap](../25-roadmap/index.md) — the phase this infrastructure is built to support.
