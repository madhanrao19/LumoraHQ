# AI Agents Handbook

## Purpose

This book defines Lumora Academy's **product-facing AI agents** — the AI features students, parents, and content teams actually interact with (the AI Tutor, lesson drafting, quiz drafting). It is not about the Claude Code agents used to *build* Lumora — see [Not to be confused with](#not-to-be-confused-with) below.

## Status

Version: 1.1 foundation draft. Names the working agent catalog from the Roadmap and draws out one important distinction (real-time vs. content-drafting safety model) that the safety principles don't spell out on their own.

## Not to be confused with

`.claude/agents/` in this repository (chief-architect, docs-writer, education-director, ai-safety-reviewer, qa-reviewer, security-reviewer) are Claude Code subagents that help *build and review Lumora's documentation and code*. They're development tooling, scoped to [Claude Code Operating System](../15-claude-code-operating-system/index.md) (not yet written). This book is about the AI agents that ship *inside the product*.

## Agent catalog (working draft)

Derived from the [Roadmap](../25-roadmap/index.md) Phase 2 scope. All three route through the single AI Gateway ([Software Architecture](../07-software-architecture/index.md#cross-cutting-principles)) — this book names the product-facing roles the Gateway serves, it doesn't redefine the architecture.

| Agent | Role | Output |
|---|---|---|
| Lesson Drafting Assistant | Drafts lesson content from approved source material | Draft, requires human review before publish |
| Quiz Drafting Assistant | Drafts assessment items and question-bank entries | Draft, requires human review before publish |
| AI Tutor | Real-time conversational help for students | Live response, not a "publishable" artifact |

## Shared contract

Every product AI agent inherits all eight [AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md) and the [AI Gateway's API contract](../10-api-architecture/index.md#the-ai-gateway-boundary) — grounded answers, no fabrication, provider abstraction, audit logging. None of that is optional per-agent.

## Two different safety models, not one

This is worth stating explicitly because the safety principles were written broadly enough to read as one-size-fits-all, and they aren't quite:

- **Lesson/Quiz Drafting agents** produce persistent content. Safety Principle 2 ("human review before publish") applies literally — output sits in a draft state until a person approves it, exactly as [API Architecture](../10-api-architecture/index.md#the-ai-gateway-boundary) already specifies.
- **The AI Tutor** produces a live conversational response — there's no "draft" state to hold a chat reply in before a human reviews it turn-by-turn. Its safety model is real-time instead of pre-publish: guardrails and moderation act *during* the conversation (Safety Principle 7 — block, escalate, or redirect unsafe content, not "queue for later review"), every exchange is still logged for audit (Safety Principle 3), and parents/authorized staff retain visibility into the conversation (Safety Principle 6).

Treating the Tutor as if it needs the same pre-publish review as a drafted lesson would either make it unusable (nothing could be said in real time) or quietly skip the requirement — neither is acceptable. It gets the same principles, applied through a different mechanism.

## Not yet decided

- The full agent list beyond these three (the catalog above is a working draft, not exhaustive).
- The AI Tutor's conversational scope — which subjects/question types it engages with versus redirects — and its specific real-time escalation triggers. This is distinct from the general "who reviews AI content" question already tracked in the [AI Development Bible](../06-ai-development-bible/index.md#human-review-and-escalation-roles) backlog item, since the Tutor's escalation is real-time, not a review queue.
- Tutor pedagogical behavior (tone, how it handles a student getting something wrong, when it prompts vs. tells) belongs to [Educational Framework](../04-educational-framework/index.md) (not yet written), not this book.

## Scope boundaries

| Topic | Owned by |
|---|---|
| Binding safety rules every agent inherits | [AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md) |
| Provider abstraction, prompt library, model selection | [AI Development Bible](../06-ai-development-bible/index.md) |
| AI Gateway module and enforcement | [Software Architecture](../07-software-architecture/index.md) |
| AI Gateway API contract | [API Architecture](../10-api-architecture/index.md#the-ai-gateway-boundary) |
| Tutor pedagogy, tone, teaching behavior | [Educational Framework](../04-educational-framework/index.md) *(not yet written)* |
| Claude Code development-tooling agents (different scope) | [Claude Code Operating System](../15-claude-code-operating-system/index.md) *(not yet written)* |

## Related documents

- [AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md) — the binding rules every agent in the catalog above inherits.
- [AI Development Bible](../06-ai-development-bible/index.md) — provider abstraction and prompt governance these agents run on.
- [Roadmap](../25-roadmap/index.md) — the Phase 2 scope this catalog is drafted from.
