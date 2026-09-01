# Architecture Decision Records

## Purpose

An ADR (Architecture Decision Record) captures one binding decision: the problem, the choice made, the alternatives considered, and the trade-offs accepted. Per [Development Standards](../08-development-standards/index.md#feature-workflow), a binding architecture decision becomes an ADR — it isn't picked implicitly in code or buried in a Slack thread.

## Status

Version: 1.3 foundation draft. All 29 drafted ADRs are accepted; the backlog below tracks decisions the other architecture books have already flagged as open.

## Process

1. Copy the [ADR template](../24-templates/adr-template.md).
2. Number it sequentially (next is `ADR-0030`).
3. Set `Status: Proposed` and fill in Context, Decision, Alternatives considered, Consequences, and Review date. Add it to [Proposed ADRs](#proposed-adrs) and remove its row from the [decision backlog](#decision-backlog) below — a Proposed ADR replaces the backlog row, since the question is now tracked in one place, not two.
4. Once agreed, set `Status: Accepted` and move it from Proposed ADRs to [Accepted ADRs](#accepted-adrs). A later decision that replaces one sets the old one's status to `Superseded` rather than deleting it — the record of *why* the old choice was made stays valuable.

## Accepted ADRs

| ADR | Title | Status |
|---|---|---|
| [0001](0001-use-laravel-filament-postgresql.md) | Use Laravel, Filament, and PostgreSQL as the Foundation Stack | Accepted |
| [0002](0002-use-token-based-sanctum-authentication.md) | Use Token-Based Sanctum Authentication for All Clients | Accepted |
| [0003](0003-github-actions-required-status-checks.md) | Use GitHub Actions with Required Status Checks for Lumora Repos | Accepted |
| [0004](0004-github-flow-branching-and-commit-conventions.md) | Use GitHub Flow with Squash Merges and Conventional Commits | Accepted |
| [0005](0005-laravel-default-api-conventions.md) | Use Laravel's Default JSON Conventions for the API Envelope, Errors, and Pagination | Accepted |
| [0006](0006-wcag-22-aa-accessibility-target.md) | Ratify WCAG 2.2 Level AA as the Accessibility Target | Accepted |
| [0007](0007-azure-key-vault-secret-manager.md) | Use Azure Key Vault as the Secret Manager | Accepted |
| [0008](0008-three-environment-topology.md) | Three Environments — Local, Staging, Production | Accepted |
| [0009](0009-azure-app-service-compute-model.md) | Use Azure App Service (Linux) as the Compute Model | Accepted |
| [0010](0010-backup-retention-and-dr-targets.md) | PostgreSQL Backup Retention and DR Targets | Accepted |
| [0011](0011-jest-frontend-unit-testing.md) | Use Jest with React Testing Library for Frontend Unit Testing | Accepted |
| [0012](0012-coverage-signal-not-gate.md) | Coverage Is a Signal, Not a Blocking Gate | Accepted |
| [0013](0013-tailwind-v4-design-tokens.md) | Use Tailwind CSS v4 with CSS-First `@theme` Tokens | Accepted |
| [0014](0014-english-only-launch-with-locale-route-scaffold.md) | English-Only Launch, with Next.js's Native Locale Route Scaffold from Day One | Accepted |
| [0015](0015-prompts-as-version-controlled-code.md) | Prompts Are Version-Controlled Code, Not Live-Editable Database Rows | Accepted |
| [0016](0016-ai-model-tiering-strategy.md) | Route AI Requests by Capability Tier, Not by Pinned Model Name | Accepted |
| [0017](0017-single-tenant-schema-defer-multi-tenancy.md) | Single-Tenant Shared Schema; Defer Multi-Tenancy Pattern to Phase 3 | Accepted |
| [0018](0018-native-policies-role-model.md) | Fixed Role Set with Native Laravel Policies, Not a Permission Package | Accepted |
| [0019](0019-parent-initiated-child-accounts.md) | Parent-Initiated Child Accounts with a Many-to-Many Link Table | Accepted |
| [0020](0020-four-tier-data-classification.md) | Four-Tier Data Classification Scheme | Accepted |
| [0021](0021-audit-log-access-model.md) | Audit Log Access via Existing Policies; Retention Duration Stays Open | Accepted |
| [0022](0022-rag-indexing-on-publish.md) | RAG Indexing Triggers Automatically on Publish, with a Per-Item Opt-Out | Accepted |
| [0023](0023-tutor-realtime-escalation-mechanism.md) | AI Tutor Escalation Mechanism — Synchronous Classification, Graduated Outcomes | Accepted |
| [0024](0024-curriculum-content-versioning.md) | Curriculum Content Versioning — Supersede, Don't Overwrite | Accepted |
| [0025](0025-analytics-event-categories-default-anonymized.md) | Three Analytics Event Categories, Anonymized by Default; Retention Stays Open | Accepted |
| [0026](0026-react-native-expo-mobile.md) | React Native with Expo for Mobile; Offline Covers Downloaded Content, Not the AI Tutor | Accepted |
| [0027](0027-shared-claude-code-plugin-across-repos.md) | Package the Claude Code Setup as a Shared Plugin Across Lumora Repos | Accepted |
| [0028](0028-tutor-scope-defined-by-rag-grounding.md) | AI Tutor Scope Is Defined by RAG Grounding, Not a Curated Subject List | Accepted |
| [0029](0029-malaysia-pdpa-applicable-regulation.md) | Malaysia's PDPA Is the Applicable Privacy Regulation | Accepted |

## Proposed ADRs

None currently — all drafted ADRs have been accepted.

## Decision backlog

Open decisions already flagged by name across the architecture books, waiting for an ADR. Listed once here even where more than one book depends on the answer:

| Decision needed | Flagged by |
|---|---|
| Human review and escalation roles for AI content | [AI Development Bible](../06-ai-development-bible/index.md#human-review-and-escalation-roles) |
| AI Tutor non-curriculum conversation policy and specific safety-classifier trigger content (scope and escalation mechanism are resolved — [ADR-0023](0023-tutor-realtime-escalation-mechanism.md), [ADR-0028](0028-tutor-scope-defined-by-rag-grounding.md)) | [AI Agents Handbook](../16-ai-agents-handbook/index.md#not-yet-decided) |
| AI Tutor teaching methodology (Socratic vs. direct instruction, scaffolding) | [Educational Framework](../04-educational-framework/index.md#ai-tutors-pedagogical-role) |
| Curriculum taxonomy (subjects, grade bands) — versioning mechanism is resolved ([ADR-0024](0024-curriculum-content-versioning.md)) | [Curriculum Framework](../05-curriculum-framework/index.md#working-structure) |

Remove a row once an ADR (even Proposed) exists to track it — see [Process](#process) above.

## Related documents

- [ADR Template](../24-templates/adr-template.md)
- [Development Standards](../08-development-standards/index.md#feature-workflow) — when an ADR is required.
