# ADR 0015: Prompts Are Version-Controlled Code, Not Live-Editable Database Rows

## Status

Proposed

## Context

[AI Development Bible](../06-ai-development-bible/index.md#prompt-library) already established the principle: prompts are a governed asset, and "a prompt change that affects production content-facing behavior gets the same review rigor as a content or code change." It left the storage/versioning/rollback mechanism open. [Testing & QA](../14-testing-qa/index.md#the-ai-testing-boundary) and [ADR-0012](0012-coverage-signal-not-gate.md) already require the AI Gateway's safety behaviors to be tested before they ship — that requirement only means something if prompt changes actually flow through CI, not around it.

Two ways to store prompts were on the table: as rows in the already-decided PostgreSQL database, live-editable through a Filament admin resource; or as version-controlled files inside the application repository, changed through the same PR pipeline as any other code.

## Decision

**Prompts are version-controlled code** — files inside `lumora-api`, owned by the AI Gateway module, changed only through normal pull requests ([ADR-0004](0004-github-flow-branching-and-commit-conventions.md)), validated by CI ([ADR-0003](0003-github-actions-required-status-checks.md)), and deployed through the normal environment promotion flow ([ADR-0008](0008-three-environment-topology.md)). No dedicated prompt-management database table, no live-editable admin UI for prompt content, and no third-party prompt-ops service.

Rollback is a `git revert` followed by redeploy through the same pipeline — the same mechanism every contributor already uses for any other code change.

## Alternatives considered

- **Live-editable database rows via a Filament admin resource.** Would let the content team iterate on prompts without an engineer or a deploy — a real operational benefit. But it requires building schema and a review-workflow UI from scratch, duplicating versioning and audit history Git already provides for free. More importantly, it would let a prompt change — which directly affects AI behavior — bypass the exact PR-review-and-CI gate that [ADR-0012](0012-coverage-signal-not-gate.md) already requires for AI Gateway safety behavior. That's a real safety gap on a child-safety-first platform, not just an engineering-elegance concern, and is the primary reason this was rejected.
- **A dedicated third-party prompt-management/prompt-ops service.** A real product category, but introduces a new vendor and integration for a solo/small team with no scale need yet — the same "don't add a service when existing tooling already covers it" reasoning [ADR-0007](0007-azure-key-vault-secret-manager.md) already applied to secrets management.
- **Version-controlled code through the normal PR/CI/deploy pipeline (chosen).** Zero new infrastructure, and keeps every prompt change inside the same reviewed, tested, and audited pipeline as any other behavior change.

## Consequences

Positive:
- No new schema, tooling, or vendor to build or maintain.
- Prompt changes get the exact same review and CI gate as code — closing a safety gap a live-editable admin UI would otherwise open.
- Rollback is a mechanism every contributor already understands, with no new tooling to learn.

Trade-offs:
- A prompt tweak requires a PR and a redeploy, not an instant live edit — slower iteration than a content-team-editable admin UI would offer. This is an accepted cost given the safety stakes involved in changing AI behavior.

## Review date

Revisit if prompt iteration speed becomes a measurable bottleneck for the content/education team once Phase 2 AI features are live and there's real usage to iterate against — not before there's real data to learn from.
