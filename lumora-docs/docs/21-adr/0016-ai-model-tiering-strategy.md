# ADR 0016: Route AI Requests by Capability Tier, Not by Pinned Model Name

## Status

Accepted

## Context

[AI Development Bible](../06-ai-development-bible/index.md#model-and-provider-selection) flagged per-task model/provider selection strategy and cost controls as open, needing resolution before Phase 2 AI features are built since it affects both the Gateway's routing logic and ongoing operating cost. OpenAI and Claude are already the decided providers ([Technology Stack](../07-software-architecture/technology-stack.md)), the AI Gateway is already the single choke point that abstracts model choice from feature code — "feature code asks the Gateway for a capability... not a specific model" ([AI Development Bible](../06-ai-development-bible/index.md#provider-abstraction-in-practice)) — and [ADR-0008](0008-three-environment-topology.md) already isolates AI cost per environment via separately-keyed credentials.

Both OpenAI and Anthropic have shipped multiple new model generations within the past year alone. Pinning a specific model name in this ADR would be stale within months — worse than not deciding, since a stale pin reads as still-current when it silently isn't. The durable decision here is a **strategy**, not a model name.

## Decision

1. **Route by capability tier, not model name.** The AI Gateway routes each request to a tier — e.g. "economical/fast," "frontier/highest-quality," "safety-classification" — rather than a hardcoded model. Which actual model fulfills each tier is a Gateway *configuration* value, updated as models change, not re-litigated as an architecture decision every time a provider ships something new.
2. **A tentative starting map from task to tier** (a hypothesis for Phase 2 implementers, not a binding rule — see [Review date](#review-date)):
   - **Draft-generation tasks** (lesson drafting, quiz drafting) use the **economical tier**. Their output is reviewed by a human before publish regardless ([AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md), requirement 2) — paying frontier-tier cost for a first draft a human will edit anyway buys no quality benefit the reviewer wouldn't catch.
   - **The AI Tutor** uses the **higher-quality tier**. It's real-time and student-facing with no human-review buffer between its output and the student ([AI Agents Handbook](../16-ai-agents-handbook/index.md#two-different-safety-models-not-one)), so it doesn't get the same cost latitude draft-generation does.
   - **Safety/moderation classification** uses a small, fast, purpose-suited model. Moderation doesn't need frontier-model reasoning — it needs to run fast and cheap on every single interaction.
3. **Cost tracking piggybacks on the audit log that already has to exist.** [AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md) requirement 3 already mandates logging every AI Gateway request/response; extending that log with token/cost metadata gives per-environment cost attribution at near-zero additional cost, rather than building a separate tracking system. Alerting thresholds on that cost data are [Infrastructure & DevOps](../13-infrastructure-devops/index.md#observability-decided-tools-undecided-policy)'s still-open alerting/on-call policy item — not duplicated here.

## Alternatives considered

- **Pin specific model names now.** The most concrete option, but the one most likely to silently rot given how fast the field moves — a stale pin is actively misleading, unlike an unresolved question. Rejected in favor of a tier-based strategy that stays valid regardless of which models exist underneath it at any given time.
- **A single model/provider for every task, no tiering.** Simplest, but ignores the reasoning that already justified provider abstraction in [AI Development Bible](../06-ai-development-bible/index.md) — spending frontier-tier cost on a first-draft lesson a human will rewrite anyway wastes money for no benefit the human reviewer wouldn't provide regardless.
- **Tier-based routing, tentative task-to-tier mapping, cost tracked via the existing audit log (chosen).** Durable as models rotate, reuses audit infrastructure already mandatory for safety reasons, and gives Phase 2 implementers a real starting point instead of an empty slate.

## Consequences

Positive:
- The decision stays valid as models change — updating which model fills a tier is a config change, not a new ADR.
- Cost tracking is nearly free, since it extends logging that's already mandatory for safety reasons.
- Phase 2 implementers get concrete starting guidance instead of nothing.

Trade-offs:
- The specific tier-to-model mapping still has to be chosen and kept current by whoever builds the Gateway — this ADR sets the strategy, not the implementation.
- Full cost-control enforcement (alerting) isn't complete until [Infrastructure & DevOps](../13-infrastructure-devops/index.md)'s alerting/on-call policy is separately resolved.

## Review date

Revisit the task-to-tier starting assignments (draft-generation → economical, Tutor → higher-quality, moderation → fast/cheap) once Phase 2 is actually built and real usage/cost data exists to validate or correct them. Treat this mapping as a hypothesis to test, not a permanent rule.
