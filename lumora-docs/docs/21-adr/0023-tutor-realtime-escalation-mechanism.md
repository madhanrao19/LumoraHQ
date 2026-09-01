# ADR 0023: AI Tutor Escalation Mechanism — Synchronous Classification, Graduated Outcomes

## Status

Accepted

## Context

[AI Agents Handbook](../16-ai-agents-handbook/index.md#not-yet-decided) flagged two things together: the Tutor's conversational scope (which subjects it engages with) and its real-time escalation triggers. These need to be split. Conversational scope is a content/product decision this project has no domain grounding to invent. The escalation **mechanism** — how a real-time classification-and-response pipeline actually works — is architecture this ADR can decide, especially now that [ADR-0016](0016-ai-model-tiering-strategy.md) already established a "safety-classification" tier and [ADR-0021](0021-audit-log-access-model.md) already established who can see the audit trail.

[AI Agents Handbook](../16-ai-agents-handbook/index.md#two-different-safety-models-not-one) already established why this can't work like content review: there's no "draft" state for a live chat reply to sit in while a human reviews it turn-by-turn, so the Tutor's safety model has to be real-time, not a review queue.

## Decision

1. **Every Tutor response is checked by the safety-classification tier ([ADR-0016](0016-ai-model-tiering-strategy.md)) synchronously, before it's returned to the student** — not queued for after-the-fact review.
2. **Three graduated outcomes**, matching [AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md) requirement 7 (unsafe content blocked, escalated, or redirected):
   - **Block:** the response is classified unsafe — it's replaced with a safe fallback message, never returned as drafted.
   - **Redirect:** the response is out-of-scope or borderline — replaced with a scope-appropriate redirect rather than continuing the exchange.
   - **Escalate:** the exchange indicates a genuine risk signal — flagged for human/parent/staff review, *in addition to* whatever safe response the Tutor gives, not instead of one.
3. **Every classification outcome is logged to the audit trail** — including a plain "pass," not just interventions — using the access model [ADR-0021](0021-audit-log-access-model.md) already decided. This gives parents and admins complete visibility into safety interventions on a linked student's conversations, not just the raw transcript.
4. **This ADR decides the mechanism only.** The specific classifier categories and thresholds that separate pass/redirect/block/escalate, and the Tutor's conversational subject-matter scope, are content/safety-policy decisions requiring domain expertise this project doesn't have — both stay explicitly open, tracked separately, not invented here.

## Alternatives considered

- **Post-hoc review only** (log everything, have staff review afterward, no real-time blocking). Matches how the draft-content review workflow works for lesson/quiz drafting — but [AI Agents Handbook](../16-ai-agents-handbook/index.md#two-different-safety-models-not-one) already explained why that doesn't fit a live conversational agent: there's no draft state to hold a chat reply in.
- **Client-side (Next.js) content filtering** instead of server-side Gateway classification. Trivially bypassable, and produces no server-side audit record — fails both the security and accountability requirements already established. The AI Gateway ([Software Architecture](../07-software-architecture/index.md#cross-cutting-principles)'s single choke point) is the only place this can correctly live.
- **Real-time Gateway-side classification, graduated outcomes, full audit logging (chosen).** Reuses the tiering concept and audit access model already decided rather than inventing new architecture, and matches the real-time safety model [AI Agents Handbook](../16-ai-agents-handbook/index.md) already required.

## Consequences

Positive:
- No new architecture invented — reuses [ADR-0016](0016-ai-model-tiering-strategy.md)'s tiering and [ADR-0021](0021-audit-log-access-model.md)'s audit access model directly.
- Matches the real-time safety model already required for a live conversational agent.
- Every intervention — and every non-intervention — is visible to the parent and admin roles that already have audit access.

Trade-offs:
- Adds a synchronous classification step to *every* Tutor turn, not just occasionally — real latency and cost on every message, an accepted cost given the stakes, but one Phase 2 implementation needs to budget for alongside [ADR-0016](0016-ai-model-tiering-strategy.md)'s still-open cost-control alerting.
- The actual trigger content — what specifically counts as unsafe or escalation-worthy — remains genuinely undecided, and is arguably the single most safety-critical open item in this whole backlog. This ADR deliberately does not attempt to invent it.

## Review date

Revisit once the specific escalation trigger content and thresholds are decided by whoever has the relevant safety/policy expertise (a distinct, still-open item), and once Phase 2 Tutor implementation reveals whether synchronous classification latency holds up in practice.
