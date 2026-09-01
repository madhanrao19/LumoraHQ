# Infrastructure & DevOps

## Purpose

This book defines hosting, environments, CI/CD, secret storage mechanics, backups, and observability operations for Lumora Academy — the operational detail that [Software Architecture](../07-software-architecture/index.md), [Database Architecture](../09-database-architecture/index.md), [Development Standards](../08-development-standards/index.md), [Security & Privacy](../12-security-privacy/index.md), and [Testing & QA](../14-testing-qa/index.md) all defer here.

## Status

Version: 1.4 foundation draft. Hosting, CDN, and observability *tools* are already decided ([Technology Stack](../07-software-architecture/technology-stack.md)); CI/CD pipeline, secret manager, environment topology, Azure compute model, and backup/DR targets now all have proposed ADRs awaiting acceptance; only alerting/on-call policy remains fully open.

## Hosting & CDN (decided)

- **Hosting:** Azure. **CDN:** Cloudflare.
- Per the [Constitution](../00-constitution/index.md#non-negotiable-principles) principle 10 (minimize vendor lock-in): prefer standard, portable services within Azure over Azure-proprietary APIs where a practical choice exists. Managed PostgreSQL/Redis are fine — they're still the standard protocol underneath, so the application isn't locked to Azure's implementation. **Compute model:** Azure App Service on Linux is the decided compute model ([ADR-0009](../21-adr/0009-azure-app-service-compute-model.md)) — a single App Service deployment for the modular monolith, not Container Apps or AKS, until the monolith is actually split.

## CI/CD

GitHub Actions is already in use in this monorepo — `.github/workflows/docs.yml` builds and strict-checks the docs site on every push/PR to `main`. [ADR-0003](../21-adr/0003-github-actions-required-status-checks.md) proposes continuing that precedent for application-repo CI, made **blocking** on PRs to `main` rather than advisory-only.

## Environments

Three environments — local, staging, production — with staging using real (but separately-keyed) AI provider credentials and local using a stub. See [ADR-0008](../21-adr/0008-three-environment-topology.md) for the promotion flow and full reasoning.

## Secrets

[Security & Privacy](../12-security-privacy/index.md#secrets-management) already states the principle — secrets are environment configuration, never committed. This book owns the mechanism: **Azure Key Vault** is the secret manager for all environments ([ADR-0007](../21-adr/0007-azure-key-vault-secret-manager.md)).

## Backups & disaster recovery

Scope is narrower than it looks, per [Database Architecture](../09-database-architecture/index.md#data-stores-and-their-roles):

- **PostgreSQL is the only store that needs a real backup/DR policy** — it's the sole source of truth. [ADR-0010](../21-adr/0010-backup-retention-and-dr-targets.md) proposes 35-day point-in-time recovery with zone-redundant storage, deferring geo-redundant backup and long-term retention until a deployment region and the applicable privacy regulation are both decided.
- Redis (cache/queue) and Meilisearch (derived search index) are explicitly disposable/reconstructable — they don't need backup, only a rebuild path.
- S3-compatible storage (files/media) relies on the storage service's native soft-delete and versioning per ADR-0010, rather than a separate backup pipeline.

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
