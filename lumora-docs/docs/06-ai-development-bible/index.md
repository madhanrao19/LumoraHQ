# AI Development Bible

## Purpose

This book defines how AI is built into Lumora Academy: provider abstraction in practice, prompt library governance, what content AI is allowed to draw on, and model/provider selection. [AI Safety Principles](ai-safety-principles.md) is this book's other pillar — the binding safety rules; this page is where the surrounding development practice lives.

## Status

Version: 1.4 foundation draft. Establishes governance principles; prompt storage/versioning and model/provider selection strategy are decided via ADR; human review roles are still open.

## Relationship to Safety Principles

[AI Safety Principles](ai-safety-principles.md) states eight binding requirements (grounded answers, human review before publish, audit logging, no fabrication, parent/staff visibility, unsafe-content handling, provider abstraction). Everything in this page exists to make those requirements practical to build against — it doesn't relax or restate them.

## Provider abstraction in practice

Requirement 8 of AI Safety Principles ("provider abstraction is mandatory") is enforced architecturally: every AI call routes through the single AI Gateway module ([Software Architecture](../07-software-architecture/index.md#cross-cutting-principles)), and no other module calls OpenAI/Claude directly. In practice this means:

- Swapping or adding a model/provider is a change inside the AI Gateway, not a code change across every feature that uses AI.
- Feature code asks the Gateway for a capability (e.g. "draft a lesson," "answer a grounded question"), not for a specific model — the Gateway decides which provider/model serves that request.

## Prompt library

Prompts are a governed asset, not inline strings scattered through feature code:

- Prompts live centrally (owned by the AI Gateway module) so they can be versioned and reviewed independently of the feature code that uses them.
- A prompt change that affects production content-facing behavior gets the same review rigor as a content or code change — it's not exempt just because it's "just a prompt."

**Storage and rollback:** [ADR-0015](../21-adr/0015-prompts-as-version-controlled-code.md) proposes prompts as version-controlled files, not database rows — changed only through the normal PR/CI/deploy pipeline, so every prompt change gets the same review and test gate as any other code change. Rollback is a `git revert`.

## RAG source boundary

Safety Principles requirement 1 ("AI should answer from approved Lumora content by default") plus the [Constitution](../00-constitution/index.md#non-negotiable-principles) principle 6 (accuracy matters) set the boundary for what RAG is allowed to index: **content that has already passed the same editorial approval as published curriculum content** — not an ad hoc scrape of any source that looks relevant. Defining that editorial approval workflow itself is [Content Operations](../17-content-operations/index.md)'s job (not yet written); this book only states the boundary the AI Gateway must respect once that workflow exists.

## Model and provider selection

OpenAI and Claude are the decided providers ([Technology Stack](../07-software-architecture/technology-stack.md)). [ADR-0016](../21-adr/0016-ai-model-tiering-strategy.md) proposes routing by capability tier (economical / higher-quality / safety-classification) rather than pinning a specific model name — durable as models rotate, since which model fills each tier is Gateway configuration, not an architecture decision. Its task-to-tier starting map is explicitly a hypothesis to validate once Phase 2 has real usage data, not a permanent rule.

## Human review and escalation roles

Safety Principles requirements 2 (human review before publish) and 7 (unsafe content blocked/escalated/redirected) are binding, but **who** reviews and **who** an escalation goes to is not yet decided — that's a staffing/process question, not an architecture one, and belongs with [Content Operations](../17-content-operations/index.md) once it exists.

## Scope boundaries

| Topic | Owned by |
|---|---|
| AI Gateway module and provider-abstraction enforcement | [Software Architecture](../07-software-architecture/index.md) |
| AI Gateway API contract (draft/published state, audit logging, no raw provider leakage) | [API Architecture](../10-api-architecture/index.md#the-ai-gateway-boundary) |
| Automated testing of AI Gateway behavior vs. content correctness | [Testing & QA](../14-testing-qa/index.md#the-ai-testing-boundary) |
| AI-specific abuse defenses, rate limiting | [Security & Privacy](../12-security-privacy/index.md#injection-abuse-defenses) |
| AI tutor/agent persona and behavior design | [AI Agents Handbook](../16-ai-agents-handbook/index.md) |
| Editorial approval workflow for content RAG can index | [Content Operations](../17-content-operations/index.md) |

## Related documents

- [AI Safety Principles](ai-safety-principles.md) — the binding rules this book's practices serve.
- [Software Architecture](../07-software-architecture/index.md) — where provider abstraction is enforced.
- [API Architecture](../10-api-architecture/index.md#the-ai-gateway-boundary) — the AI Gateway's API contract.
