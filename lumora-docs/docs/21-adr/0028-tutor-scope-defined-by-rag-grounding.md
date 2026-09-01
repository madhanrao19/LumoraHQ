# ADR 0028: AI Tutor Scope Is Defined by RAG Grounding, Not a Curated Subject List

## Status

Accepted

## Context

[AI Agents Handbook](../16-ai-agents-handbook/index.md#not-yet-decided) flagged the Tutor's conversational scope (which subjects/question types it engages with versus redirects) as open, bundled with the specific safety-classifier trigger content [ADR-0023](0023-tutor-realtime-escalation-mechanism.md) already left open. These are two different axes — "is this topic in scope" and "is this content unsafe" — and scope specifically doesn't need to wait on a hand-curated subject list to be decidable, because two things already exist to define it from: [AI Development Bible](../06-ai-development-bible/index.md#rag-source-boundary)'s RAG boundary (only approved, published content is indexed) and [AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md) requirements 1 (answer from approved content by default) and 5 (clearly say when it doesn't know).

[Curriculum Framework](../05-curriculum-framework/index.md#working-structure)'s taxonomy question (which subjects, grade bands) remains genuinely open — but scope doesn't have to be defined as a curated list that waits for that taxonomy. It can be defined *relative to* whatever content is actually approved and indexed, whatever that ends up being.

## Decision

**The Tutor's conversational scope is defined dynamically by RAG groundability, not a hand-curated subject allowlist:**

1. If a student's question can be answered from RAG-indexed approved content ([ADR-0022](0022-rag-indexing-on-publish.md)), the Tutor engages, grounded in that content.
2. If a question falls outside what's indexed — no relevant approved content is retrieved — the Tutor does **not** fall back to general, ungrounded model knowledge to answer anyway. Per Safety Principle 1, it says so honestly (Safety Principle 5) and redirects, rather than guessing.
3. This makes scope self-expanding as curriculum content grows: whatever gets published and indexed becomes in-scope automatically, with no separately maintained allowlist for content editors to keep in sync with the curriculum.

**This does not decide:** whether the Tutor should ever engage in genuinely non-curriculum conversation (a product/tone question, closer to teaching methodology than architecture); or the specific safety-classifier trigger content [ADR-0023](0023-tutor-realtime-escalation-mechanism.md) already left open — a question can be simultaneously in-scope-by-this-definition and unsafe by that classifier, and this ADR doesn't override that check.

## Alternatives considered

- **A hand-curated subject allowlist maintained separately from the curriculum content.** Gives precise control, but creates a second thing to keep in sync with whatever curriculum actually exists — every new lesson published would also need a manual "add to Tutor scope" step. That's exactly the silent-gap risk [ADR-0022](0022-rag-indexing-on-publish.md) already rejected for RAG indexing itself: an editor publishes new content, forgets the separate scope flag, and the Tutor either can't discuss it or discusses it ungrounded.
- **Let the Tutor answer anything using general model knowledge, unconstrained by RAG.** Simplest, but directly violates Safety Principles 1 and 4 (answer from approved content, don't fabricate) — the Tutor would be reasoning from the underlying model's general training instead of Lumora's actual curriculum, defeating the RAG architecture already built specifically to prevent that.
- **Scope defined by RAG groundability, ungrounded questions declined or redirected honestly (chosen).** Reuses the RAG boundary and indexing trigger already decided, scope automatically tracks whatever curriculum content actually exists, and keeps the Tutor's "I don't know" behavior doing real safety work instead of being a rarely-hit edge case.

## Consequences

Positive:
- No separate scope list to build or maintain — reuses RAG grounding, already decided, as the mechanism.
- Scope automatically tracks whatever curriculum content actually exists, with no manual sync step.
- Keeps the Tutor's honesty requirement (Safety Principle 5) as the actual out-of-scope handling mechanism, not a rarely-exercised fallback.

Trade-offs:
- Doesn't resolve whether the Tutor should ever engage in genuinely non-curriculum conversation (e.g. general life advice unrelated to any subject) — a real product/tone decision, not this ADR's to make.
- The specific safety-classifier trigger content remains open per [ADR-0023](0023-tutor-realtime-escalation-mechanism.md) — this ADR defines topical scope, not safety classification, and doesn't touch that separate axis.

## Review date

Revisit if RAG-grounding-based scope proves too restrictive in practice — for example, if students frequently ask reasonable curriculum-adjacent questions that fall just outside indexed content — once Phase 2's Tutor is actually built and in real use.
