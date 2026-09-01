# Runbooks

## Purpose

Step-by-step operational procedures for specific situations — incident response, deployment rollback, database restore — as distinct from [Playbooks](../22-playbooks/index.md), which are higher-level strategic/process guides.

## Status

Version: 0.1 — none written. Writing a runbook before the procedure it describes actually exists would just be fiction; a "restore from backup" runbook, for instance, needs [Infrastructure & DevOps](../13-infrastructure-devops/index.md#backups-disaster-recovery)'s backup policy decided first, which it isn't yet. Runbooks start getting written once Phase 1 infrastructure is real.

## Scope boundaries

| Topic | Owned by |
|---|---|
| Strategic/process guides (different from step-by-step procedures) | [Playbooks](../22-playbooks/index.md) |
| The infrastructure decisions most runbooks will depend on | [Infrastructure & DevOps](../13-infrastructure-devops/index.md) |

## Related documents

- [Playbooks](../22-playbooks/index.md) — the strategic counterpart to this book.
- [Infrastructure & DevOps](../13-infrastructure-devops/index.md) — the prerequisite decisions most runbooks here will depend on.
