# AI Tutor Safety Policy Questionnaire

## Purpose

[ADR-0023](../21-adr/0023-tutor-realtime-escalation-mechanism.md) built the Tutor's safety-classification *mechanism* — synchronous classification, four graduated outcomes, full audit logging — and is explicit that it deliberately does not decide "the specific classifier categories and thresholds that separate pass/redirect/block/escalate," calling that "content/safety-policy decisions requiring domain expertise this project doesn't have" and "arguably the single most safety-critical open item in this whole backlog." This page is the question list for whoever has that expertise. It doesn't propose answers — the questions themselves are drawn directly from what ADR-0023 and [ADR-0028](../21-adr/0028-tutor-scope-defined-by-rag-grounding.md) already named as open, not invented for this page.

**Current baseline behavior, so you know what's live today:** the classifier tier defaults to `NullAiProvider` (unconfigured — see [ADR-0016](../21-adr/0016-ai-model-tiering-strategy.md)), so every classification is currently unparseable and the mechanism **fails closed to Block on everything** — no answer currently reaches a student unfiltered. That's a safe default, not a finished policy. Real `OpenAiProvider`/`ClaudeProvider` implementations now exist (`lumora-api/app/AiGateway/Providers/`) but aren't active by default — activating one is a config change (`AI_*_PROVIDER=openai|claude` plus a real API key), not a code change, and hasn't been done in this environment (no real credentials exist here). Answering the questions below is what makes activating one actually usable, not just possible.

## Questions

### 1. Classifier categories

What are the actual content categories the classifier should check every Tutor response against? ADR-0023 requires the mechanism to sort into Pass / Redirect / Block / Escalate but names no categories. Starting points a real policy would typically define (not a proposal, just naming the shape of the question): violent content, self-harm/suicide, sexual content, harassment/bullying, requests for personal information, medical/legal/financial advice beyond curriculum scope, hate speech. Which of these apply, which don't, and what's missing for an education product serving children?

### 2. Thresholds per category

For each category in (1), what separates a **Pass** from a **Redirect** from a **Block**? E.g., a student asking "why do people bully others" is presumably in-scope curriculum-adjacent discussion (Pass or Redirect), while explicit bullying language directed at someone is presumably Block — where exactly is that line, and does it differ by category?

### 3. Escalation trigger

What specifically constitutes the "genuine risk signal" ADR-0023 requires for **Escalate**? This is distinct from Block (unsafe content is suppressed) — Escalate means the exchange itself indicates the *student* may be at risk (e.g. language suggesting self-harm, abuse disclosure, distress) and needs a human to actually look, not just have the message filtered.

### 4. Escalation response protocol

ADR-0023 requires escalation be "flagged for human/parent/staff review, in addition to whatever safe response the Tutor gives." The current implementation sends an email notification to the student's linked parent(s) and all Admins the moment an Escalate outcome fires (`TutorEscalationRaised`, built this session). Is email-to-parent-and-admin the right response, or does a genuine risk signal need something faster/different (e.g. a required acknowledgment, an escalation to a specific trained staff role rather than "all admins," a defined response-time SLA)? **This question has a legal dimension** — see the [PDPA legal review checklist](../12-security-privacy/pdpa-legal-review-checklist.md#other-things-this-projects-own-docs-have-named-as-needing-a-decision) item 10: does Malaysian law impose any mandatory-reporting duty in some subset of these cases that the current parent/admin-only notification doesn't satisfy? Get that legal answer before finalizing this protocol, not after.

### 5. Conversational scope beyond curriculum

[ADR-0028](../21-adr/0028-tutor-scope-defined-by-rag-grounding.md) decided *topical* scope is whatever's RAG-indexed (if the Tutor can find approved content to answer from, it engages; otherwise it redirects honestly rather than guessing). It explicitly leaves open a different question: "whether the Tutor should ever engage in genuinely non-curriculum conversation (a product/tone question, closer to teaching methodology than architecture)" — e.g. a student asking the Tutor something unrelated to any subject, like general life advice or just wanting to chat. Should the Tutor ever engage with that, redirect it every time, or something in between?

### 6. Classifier latency tolerance

ADR-0023 names this as a real, still-open trade-off: synchronous classification adds latency to every single Tutor turn. Once a real classifier is wired in, is there a maximum acceptable response-time budget, and if the classifier can't meet it, what's the fallback (still fail closed, per the current default? something else)?

## Not in scope for this questionnaire

- The classification *mechanism* itself (synchronous, per-turn, audit-logged) — [ADR-0023](../21-adr/0023-tutor-realtime-escalation-mechanism.md) already decided that; these questions are about content and thresholds within that mechanism, not the architecture.
- Topical scope-by-RAG-grounding — [ADR-0028](../21-adr/0028-tutor-scope-defined-by-rag-grounding.md) already decided that; question 5 above is the one thing it explicitly left open, not the whole scope question.

## Related documents

- [ADR-0023](../21-adr/0023-tutor-realtime-escalation-mechanism.md) — the escalation mechanism these questions fill in.
- [ADR-0028](../21-adr/0028-tutor-scope-defined-by-rag-grounding.md) — the scope decision question 5 extends.
- [PDPA Legal Review Checklist](../12-security-privacy/pdpa-legal-review-checklist.md) — question 4's legal-reporting overlap.
