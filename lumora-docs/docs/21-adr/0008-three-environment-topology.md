# ADR 0008: Three Environments — Local, Staging, Production

## Status

Accepted

## Context

[Infrastructure & DevOps](../13-infrastructure-devops/index.md#environments) flagged environment topology as fully open and urgent — "resolved via ADR before the first deployable Phase 1 feature exists, since [API Architecture](../10-api-architecture/index.md) and [AI Development Bible](../06-ai-development-bible/index.md) both assume *some* non-production environment exists to test against." It named three open questions: how many environments, how code is promoted between them, and what differs between them — specifically calling out whether staging should hit real AI providers or a stub.

This also has somewhere to attach now that it didn't before: [ADR-0003](0003-github-actions-required-status-checks.md) (CI) and [ADR-0004](0004-github-flow-branching-and-commit-conventions.md) (branching/PR flow) give this ADR a concrete pipeline to define promotion around, instead of an abstract one.

## Decision

**Three environments: local, staging, production.**

1. **Promotion flow:** local development happens on a feature branch → PR → merge to `main` triggers CI ([ADR-0003](0003-github-actions-required-status-checks.md)) → automatic deploy to **staging** → **manual** promotion to **production** (not automatic). Manual production promotion stays the rule until a real release process exists — see [Testing & QA](../14-testing-qa/index.md#release-readiness)'s release-readiness gate and [Release Notes](../26-release-notes/index.md), both still early.
2. **AI provider usage per environment** (the specific question Infrastructure & DevOps called out): **local uses a stubbed/mocked AI provider** by default — no real OpenAI/Claude calls — to keep local development fast, free, and safe from generating real audit-log/cost noise. **Staging uses real provider credentials, scoped to separate staging-only API keys** — never production keys — so usage, cost, and audit trails stay isolated between staging and production. Production uses production credentials.
3. **Secrets are scoped per environment** in [Azure Key Vault](0007-azure-key-vault-secret-manager.md) — each environment gets its own secret set, not one shared vault across all three.

## Alternatives considered

- **Two environments (staging + production only), no formal local environment.** Simpler on paper, but every developer already needs *some* isolated local loop to test destructive changes (migrations, prompt changes) safely — formalizing what would otherwise exist ad hoc costs nothing extra and gives it a defined AI-provider policy instead of an implicit one.
- **Four or more environments (add a dedicated QA/UAT tier).** Matches larger teams' needs, but is premature process for a solo-maintained project with no Phase 1 code yet — the same reasoning [ADR-0004](0004-github-flow-branching-and-commit-conventions.md) already used to reject Git Flow's extra branches. Revisit if team size or release cadence grows enough to justify it.
- **Three environments (chosen).** Matches the team's actual current size and the lightweight-process approach already adopted in ADR-0003 and ADR-0004.

## Consequences

Positive:
- Unblocks Phase 1 feature work immediately — API Architecture and AI Development Bible both assumed a non-production environment exists; now one is actually defined.
- AI cost and safety are isolated between local, staging, and production by construction, not by convention someone has to remember.
- Matches team size — no process built for a team that doesn't exist yet.

Trade-offs:
- Manual production promotion is a deliberate bottleneck; it should be revisited once release cadence increases or a real release process exists, not left as permanent friction.
- Staging needs its own AI provider budget and monitoring — a small recurring cost, separate from production's, that's easy to forget to track since it's not customer-facing.

## Review date

Revisit once release cadence or team size grows enough to justify automatic production promotion or a dedicated QA/UAT tier — not before.
