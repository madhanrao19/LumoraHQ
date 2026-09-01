# ADR 0022: RAG Indexing Triggers Automatically on Publish, with a Per-Item Opt-Out

## Status

Accepted

## Context

[Content Operations](../17-content-operations/index.md#not-yet-decided) flagged RAG-indexing trigger mechanics as open — specifically, whether content becomes RAG-eligible automatically on publish or requires a separate flag. [AI Development Bible](../06-ai-development-bible/index.md#rag-source-boundary) already set the boundary: RAG may only index content that has passed the same editorial approval as published curriculum content. That boundary already implies a timing answer — "approved" and "published" are the same event — which this ADR makes explicit rather than leaving as a second, separately-triggered step.

## Decision

1. **Publishing curriculum/lesson content automatically triggers RAG indexing.** No separate manual step is required for the common case, since the "approved content" boundary already established *is* the publish approval bar — requiring a second manual flag on top of that creates a real risk of silently incomplete RAG coverage (an editor publishes a lesson, forgets to flag it, and the AI Tutor simply doesn't know it exists). That gap works directly against [AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md) requirement 4 (AI must not fabricate curriculum facts) — incomplete grounding data increases the odds a model guesses instead of citing nothing.
2. **A per-item opt-out flag** exists for published content that shouldn't be retrieved as knowledge even though it's live — time-sensitive announcements, scheduling notices, or other non-knowledge content. The default is *included*; exclusion is a deliberate choice, not a default state someone has to remember to reverse.
3. **Un-publishing or archiving content removes it from the RAG index at the same moment.** The index should never retrieve content that's no longer live or approved — the same publish-triggers-indexing symmetry applies in reverse.

## Alternatives considered

- **A separate manual "add to RAG" step for every published item (opt-in).** Gives full per-item control, but risks exactly the silent-incompleteness failure described above — indistinguishable from a bug until someone notices the Tutor doesn't know about recently published material. Rejected primarily on safety/accuracy grounds, not just convenience.
- **A periodic batch re-sync of all published content on a schedule** (e.g. nightly), avoiding an event-driven trigger. Newly published content wouldn't be retrievable until the next run, and removal (un-publish) wouldn't be handled promptly either — a real staleness window in both directions, for negligible complexity savings over a publish/unpublish event hook that already fires as part of the content lifecycle.
- **Automatic on publish/unpublish with an explicit per-item opt-out (chosen).** Matches the "approved = published" boundary exactly, avoids the silent-gap risk of a manual opt-in step, and still allows deliberate exclusion for genuine edge cases.

## Consequences

Positive:
- RAG coverage stays complete and current by construction, tied to an event that already exists in the content lifecycle — not a second step someone can forget.
- Directly reduces fabrication risk by keeping grounding data current with what's actually approved and live.
- The opt-out flag handles real edge cases without per-item busywork for the common case.

Trade-offs:
- Every publish action now has a side effect (triggering re-indexing/embedding generation) that content editors need to be aware exists, even if it's invisible to them day-to-day — a small operational cost (indexing latency, embedding generation cost) that belongs with whatever eventually resolves per-task AI cost controls ([AI Development Bible](../06-ai-development-bible/index.md#model-and-provider-selection), [ADR-0016](0016-ai-model-tiering-strategy.md)), not re-litigated here.
- The opt-out flag needs a real field in whatever the eventual Filament content-editing experience looks like — a small, genuine feature requirement, not automatic.

## Review date

Revisit if a real content type emerges needing more granular RAG-inclusion rules than a simple per-item opt-out (e.g. different retrieval treatment per subject or grade band) — not before there's a concrete need for it.
