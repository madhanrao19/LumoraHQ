# Architecture Decision Records

## Purpose

An ADR (Architecture Decision Record) captures one binding decision: the problem, the choice made, the alternatives considered, and the trade-offs accepted. Per [Development Standards](../08-development-standards/index.md#feature-workflow), a binding architecture decision becomes an ADR — it isn't picked implicitly in code or buried in a Slack thread.

## Status

Version: 1.2 foundation draft. One ADR is accepted, seventeen are proposed and awaiting review; the backlog below tracks decisions the other architecture books have already flagged as open.

## Process

1. Copy the [ADR template](../24-templates/adr-template.md).
2. Number it sequentially (next is `ADR-0019`).
3. Set `Status: Proposed` and fill in Context, Decision, Alternatives considered, Consequences, and Review date. Add it to [Proposed ADRs](#proposed-adrs) and remove its row from the [decision backlog](#decision-backlog) below — a Proposed ADR replaces the backlog row, since the question is now tracked in one place, not two.
4. Once agreed, set `Status: Accepted` and move it from Proposed ADRs to [Accepted ADRs](#accepted-adrs). A later decision that replaces one sets the old one's status to `Superseded` rather than deleting it — the record of *why* the old choice was made stays valuable.

## Accepted ADRs

| ADR | Title | Status |
|---|---|---|
| [0001](0001-use-laravel-filament-postgresql.md) | Use Laravel, Filament, and PostgreSQL as the Foundation Stack | Accepted |

## Proposed ADRs

Drafted and awaiting review/acceptance — not yet binding.

| ADR | Title | Status |
|---|---|---|
| [0002](0002-use-token-based-sanctum-authentication.md) | Use Token-Based Sanctum Authentication for All Clients | Proposed |
| [0003](0003-github-actions-required-status-checks.md) | Use GitHub Actions with Required Status Checks for Lumora Repos | Proposed |
| [0004](0004-github-flow-branching-and-commit-conventions.md) | Use GitHub Flow with Squash Merges and Conventional Commits | Proposed |
| [0005](0005-laravel-default-api-conventions.md) | Use Laravel's Default JSON Conventions for the API Envelope, Errors, and Pagination | Proposed |
| [0006](0006-wcag-22-aa-accessibility-target.md) | Ratify WCAG 2.2 Level AA as the Accessibility Target | Proposed |
| [0007](0007-azure-key-vault-secret-manager.md) | Use Azure Key Vault as the Secret Manager | Proposed |
| [0008](0008-three-environment-topology.md) | Three Environments — Local, Staging, Production | Proposed |
| [0009](0009-azure-app-service-compute-model.md) | Use Azure App Service (Linux) as the Compute Model | Proposed |
| [0010](0010-backup-retention-and-dr-targets.md) | PostgreSQL Backup Retention and DR Targets | Proposed |
| [0011](0011-jest-frontend-unit-testing.md) | Use Jest with React Testing Library for Frontend Unit Testing | Proposed |
| [0012](0012-coverage-signal-not-gate.md) | Coverage Is a Signal, Not a Blocking Gate | Proposed |
| [0013](0013-tailwind-v4-design-tokens.md) | Use Tailwind CSS v4 with CSS-First `@theme` Tokens | Proposed |
| [0014](0014-english-only-launch-with-locale-route-scaffold.md) | English-Only Launch, with Next.js's Native Locale Route Scaffold from Day One | Proposed |
| [0015](0015-prompts-as-version-controlled-code.md) | Prompts Are Version-Controlled Code, Not Live-Editable Database Rows | Proposed |
| [0016](0016-ai-model-tiering-strategy.md) | Route AI Requests by Capability Tier, Not by Pinned Model Name | Proposed |
| [0017](0017-single-tenant-schema-defer-multi-tenancy.md) | Single-Tenant Shared Schema; Defer Multi-Tenancy Pattern to Phase 3 | Proposed |
| [0018](0018-native-policies-role-model.md) | Fixed Role Set with Native Laravel Policies, Not a Permission Package | Proposed |

## Decision backlog

Open decisions already flagged by name across the architecture books, waiting for an ADR. Listed once here even where more than one book depends on the answer:

| Decision needed | Flagged by |
|---|---|
| Parent-child account relationship model | [Security & Privacy](../12-security-privacy/index.md#not-yet-decided) |
| Applicable privacy regulation(s) (COPPA/GDPR/PDPA-equivalent) | [Security & Privacy](../12-security-privacy/index.md#not-yet-decided) |
| Data classification scheme (personal vs. sensitive/child-related) | [Database Architecture](../09-database-architecture/index.md#privacy-and-child-safety-in-schema-design), [Security & Privacy](../12-security-privacy/index.md#not-yet-decided) |
| Audit log access and retention policy | [Security & Privacy](../12-security-privacy/index.md#not-yet-decided) |
| Human review and escalation roles for AI content | [AI Development Bible](../06-ai-development-bible/index.md#human-review-and-escalation-roles) |
| AI Tutor conversational scope and real-time escalation triggers | [AI Agents Handbook](../16-ai-agents-handbook/index.md#not-yet-decided) |
| AI Tutor teaching methodology (Socratic vs. direct instruction, scaffolding) | [Educational Framework](../04-educational-framework/index.md#ai-tutors-pedagogical-role) |
| Curriculum taxonomy (subjects, grade bands) and content versioning | [Curriculum Framework](../05-curriculum-framework/index.md#working-structure) |
| RAG-indexing trigger mechanics (auto on publish vs. separate flag) | [Content Operations](../17-content-operations/index.md#not-yet-decided) |
| Analytics event taxonomy and retention period | [Analytics & Data](../18-analytics-data/index.md#not-yet-decided) |
| Mobile framework and offline support strategy | [Mobile Platform](../19-mobile-platform/index.md#not-yet-decided) |
| Whether other Lumora repos adopt this repo's Claude Code agent/command setup | [Claude Code Operating System](../15-claude-code-operating-system/index.md#session-rules) |

Remove a row once an ADR (even Proposed) exists to track it — see [Process](#process) above.

## Related documents

- [ADR Template](../24-templates/adr-template.md)
- [Development Standards](../08-development-standards/index.md#feature-workflow) — when an ADR is required.
