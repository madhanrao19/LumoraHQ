# Claude Code Operating System

## Purpose

This book documents how Claude Code is configured and used to build and maintain Lumora Academy's repositories — the custom subagents, slash commands, and session rules already set up in this repository. It's development tooling, distinct from [AI Agents Handbook](../16-ai-agents-handbook/index.md), which covers the AI agents that ship *inside the product*.

## Status

Version: 1.3 foundation draft. Documents what's actually configured in `lumora-docs/.claude/` today as a living reference. Whether other Lumora repos adopt this setup is decided via ADR.

## Custom subagents

Defined in `.claude/agents/` and available to any Claude Code session working in this repository:

| Subagent | Reviews |
|---|---|
| `chief-architect` | System architecture, modularity, scalability, maintainability, long-term technical trade-offs |
| `docs-writer` | Maintains clear, accurate, versioned documentation based only on verified project facts |
| `education-director` | Learning value, age appropriateness, pedagogy, assessment quality, learning outcomes |
| `ai-safety-reviewer` | Child safety, hallucination risk, grounding, moderation, unsafe outputs, auditability |
| `qa-reviewer` | Acceptance criteria, testing plans, regressions, accessibility, release readiness |
| `security-reviewer` | Authentication, authorization, privacy, secrets, injection risks, abuse vectors, audit controls |

## Custom slash commands

Defined in `.claude/commands/`:

| Command | Purpose |
|---|---|
| `/goal` | Focus on one clear goal: read relevant docs, inspect files, break into small steps, execute safely, verify, and report |
| `/verify` | Check correctness, missing files, broken links, child safety, privacy, security, docs consistency, and tests before calling work complete |
| `/handoff` | Produce a clean handoff summary: goal, status, files changed, decisions, known issues, commands run, next steps, risks, and the exact prompt to continue |
| `/review-ai` | Review AI behavior, prompt design, safety, grounding, hallucination risk, audit logging, and child suitability |
| `/review-curriculum` | Review curriculum alignment, learning outcomes, difficulty, misconceptions, progression, and content originality |
| `/review-security` | Review security, auth, authorization, secrets, child data protection, privacy, audit logs, and abuse risks |
| `/roast` | Adversarial review from seven angles (contrarian, parent, student, teacher, security, operator, judge) — verdict: GREEN LIGHT, RESHAPE, or KILL |

## How this maps to the feature workflow

`/goal` and `/verify` are the practical execution of [Development Standards](../08-development-standards/index.md#feature-workflow)' verify-before-complete expectation; `/handoff` supports continuity between sessions on the same piece of work. The review commands (`/review-ai`, `/review-curriculum`, `/review-security`, `/roast`) map directly onto the subagents above — use the command or invoke the subagent by name, whichever fits the moment.

## Session rules

`lumora-docs/CLAUDE.md` sets the binding rules for any Claude Code session editing this repository (naming conventions, copyright discipline, verification requirement). It's referenced here, not duplicated — see the file itself for the current rules.

[ADR-0027](../21-adr/0027-shared-claude-code-plugin-across-repos.md) proposes packaging this setup as a shared plugin — the same mechanism already used for the `ponytail` plugin in this repository — installed into `lumora-api`, `lumora-academy`, and other Lumora repos once scaffolded, rather than each repo building or copying its own.

## Scope boundaries

| Topic | Owned by |
|---|---|
| The feature/ADR workflow these tools execute | [Development Standards](../08-development-standards/index.md) |
| Product-facing AI agents (different scope entirely) | [AI Agents Handbook](../16-ai-agents-handbook/index.md) |

## Related documents

- [Development Standards](../08-development-standards/index.md#feature-workflow) — the workflow `/goal`, `/verify`, and `/handoff` execute.
- [AI Agents Handbook](../16-ai-agents-handbook/index.md#not-to-be-confused-with) — the explicit distinction from product AI agents.
