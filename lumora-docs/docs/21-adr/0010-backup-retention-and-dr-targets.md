# ADR 0010: PostgreSQL Backup Retention and DR Targets

## Status

Accepted

## Update (2026-09-04)

This ADR's trigger (b) — the applicable-regulation item — has resolved: [ADR-0029](0029-malaysia-pdpa-applicable-regulation.md) confirms Malaysia's PDPA, whose Retention Principle is disposal-when-no-longer-necessary, not a mandated minimum retention period. That resolution argues *against* adopting Long-Term Retention on regulatory grounds, not for it — PDPA doesn't create a compliance requirement LTR would satisfy. Point 3's conclusion (don't adopt LTR yet) stands, now on firmer footing rather than pending. Trigger (a) — an actual deployment region — remains unchosen (no infrastructure has been deployed), so it's still the live open condition, not (b).

## Context

[Infrastructure & DevOps](../13-infrastructure-devops/index.md#backups-disaster-recovery) already narrowed the scope, per [Database Architecture](../09-database-architecture/index.md#data-stores-and-their-roles): PostgreSQL is the only store needing a real backup/DR policy (it's the sole source of truth); Redis and Meilisearch are disposable/reconstructable; S3-compatible storage needs its own, lighter retention approach since it holds referenced content, not relational data. Frequency, retention window, and DR targets were flagged as fully open.

Verified before writing this (2026-09-01), Azure Database for PostgreSQL Flexible Server's actual backup capabilities (relevant since [ADR-0009](0009-azure-app-service-compute-model.md) already puts the app on Azure, and managed PostgreSQL is already accepted as a portable-enough choice under [ADR-0001](0001-use-laravel-filament-postgresql.md)): automated daily snapshot backups plus continuous WAL log archiving give point-in-time recovery (PITR) with an RPO of up to ~5 minutes; retention is configurable from 7 days (default) up to 35 days at no extra storage cost (backup storage is free up to 100% of provisioned server storage); zone-redundant backup storage is the automatic default in regions that support availability zones; geo-redundant backup is available but must be chosen at server creation and can't be added later; a separate Long-Term Retention (LTR) add-on exists for compliance-grade `pg_dump`-based retention up to 10 years.

## Decision

1. **Enable PITR with the maximum 35-day retention window**, not the 7-day default — free at this storage scale, and a meaningfully longer window to notice and recover from a slow-discovered problem (a bad migration, an accidental deletion) matters more on a platform holding child data than the cost difference, which is zero.
2. **Use zone-redundant backup storage** (Azure's automatic default where the region supports availability zones) — protects against a single-zone failure without committing to cross-region complexity.
3. **Do not adopt geo-redundant backup or Long-Term Retention yet.** Both are real, available options — deliberately deferred, not overlooked. Geo-redundant backup requires committing to a deployment region and its paired region, which no document in this repository has chosen yet. LTR is heavy compliance tooling that should follow an actual regulatory requirement, not precede one — [Security & Privacy](../12-security-privacy/index.md#applicable-regulation)'s "applicable privacy regulation(s)" item is still open.
4. **S3-compatible storage relies on the storage service's native soft-delete and versioning**, not a separate backup pipeline — proportionate protection against accidental deletion/overwrite at this stage, not a full disaster-recovery system for content that doesn't yet have real user volume.
5. **Accept Azure's documented RTO/RPO as-is for now**: RPO up to ~5 minutes (continuous WAL-based recovery), RTO "a few minutes up to a few hours" depending on data volume — not hardened into a specific SLA, since no uptime commitment to end users exists yet.

## Alternatives considered

- **Keep the 7-day default retention.** Costs nothing more to extend to 35 days, so there's no real reason to accept a shorter recovery window for the sake of it.
- **Geo-redundant backup and cross-region DR from day one.** The most resilient option, but requires deciding a deployment region (and its pair) that isn't chosen anywhere yet, plus ongoing cost and complexity before there's a user base or uptime commitment that needs it.
- **Long-Term Retention from day one.** Justified once the actual regulatory regime is known, not before — adopting 10-year compliance retention now would be guessing at a requirement instead of building to a decided one.
- **Custom backup scripting** (e.g., scheduled `pg_dump` to separate storage). Full control, but reinvents what the managed service already provides for free — the same "use the platform default" reasoning already applied in [ADR-0005](0005-laravel-default-api-conventions.md) and [ADR-0007](0007-azure-key-vault-secret-manager.md).

## Consequences

Positive:
- Near-zero additional cost — 35-day backup storage is free at this provisioned size.
- A meaningful recovery window for negligible extra effort.
- Zone-level resilience without committing to unproven cross-region complexity.
- S3-compatible storage gets protection proportionate to what's actually at risk today.

Trade-offs:
- No cross-region DR yet — a full regional Azure outage means real downtime/data-loss exposure until geo-redundancy is revisited.
- RTO is "a few minutes to a few hours" per Azure's own documentation, not a hard SLA — acceptable pre-launch, but will need firming up once real users depend on uptime.

## Review date

Trigger (b) has resolved — see Update above; it did not end up justifying LTR. Revisit once an actual Azure deployment region is chosen (trigger (a), still open) — that could still justify geo-redundant backup.
