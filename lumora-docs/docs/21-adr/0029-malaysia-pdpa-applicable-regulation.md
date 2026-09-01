# ADR 0029: Malaysia's PDPA Is the Applicable Privacy Regulation

## Status

Accepted

## Context

[Security & Privacy](../12-security-privacy/index.md) flagged the applicable privacy regulation as the single most consequential open item — blocking audit log retention duration ([ADR-0021](0021-audit-log-access-model.md)) and analytics retention duration ([ADR-0025](0025-analytics-event-categories-default-anonymized.md)), and affecting consent and age-gating design. This wasn't something to guess at; it was confirmed directly: **Lumora Academy targets Malaysia only.** Malaysia's Personal Data Protection Act 2010, as amended by the Personal Data Protection (Amendment) Act 2024 (in force in stages through 2025), is the applicable regulation.

Verified before writing this (2026-09-01), three things that change what's actually decidable here:

- **PDPA's retention rule is principle-based, not a fixed period.** The Act's "Retention Principle" requires disposal once data is no longer necessary for its stated purpose — it doesn't hand down a specific number of days or years the way some regimes do.
- **PDPA has no COPPA/GDPR-Article-8-style special provision for children's data** — no specific age threshold or distinct parental-consent mechanism beyond its general data protection obligations, even after the 2024 amendment.
- **Cross-border transfer (relevant since Lumora is Azure-hosted) is permitted, not blocked**, under PDPA Section 129 and the 2025 Cross-Border Personal Data Transfer Guidelines — via an adequacy assessment, data subject consent, contractual necessity, or standard contractual safeguards. There's no data-localization mandate requiring Malaysia-only hosting.

## Decision

1. **Malaysia's PDPA (2010, as amended 2024) is the privacy regulation Lumora Academy designs against**, given the confirmed Malaysia-only target market.
2. **Retention policy for [ADR-0021](0021-audit-log-access-model.md) (audit logs) and [ADR-0025](0025-analytics-event-categories-default-anonymized.md) (analytics)**: follow PDPA's actual Retention Principle rather than inventing a fixed duration the law itself doesn't specify. Concretely — retain data while the associated account is active (the ongoing safety/product purpose that justifies holding it); on account deletion, purge personal and Sensitive/Child-classified data ([ADR-0020](0020-four-tier-data-classification.md)) within a bounded window, not indefinitely. The exact window (e.g. 30–90 days, to allow for deletion-request processing and backup rotation per [ADR-0010](0010-backup-retention-and-dr-targets.md)) is an operational implementation choice, not a legal minimum PDPA sets — it can be picked pragmatically when built.
3. **No additional PDPA-specific child-data mechanism is required.** The child-safety protections already decided — parent-initiated accounts ([ADR-0019](0019-parent-initiated-child-accounts.md)), Sensitive/Child classification ([ADR-0020](0020-four-tier-data-classification.md)), parent-scoped audit access ([ADR-0021](0021-audit-log-access-model.md)) — already exceed what PDPA itself strictly requires, since PDPA has no distinct children's-data provision. Those decisions were the right call independent of this regulation, and PDPA doesn't ask for more.
4. **Cross-border hosting on Azure remains legally viable** under PDPA Section 129 via standard cloud-provider contractual safeguards — no localization requirement blocks the hosting decision already made ([ADR-0009](0009-azure-app-service-compute-model.md)).

## Alternatives considered

- **Design against multiple regulatory regimes (PDPA + GDPR + COPPA) preemptively.** More defensive, but the confirmed scope is Malaysia-only — building for regimes that don't apply yet is the same premature-complexity pattern already rejected throughout this backlog ([ADR-0008](0008-three-environment-topology.md)'s environments, [ADR-0014](0014-english-only-launch-with-locale-route-scaffold.md)'s i18n, [ADR-0017](0017-single-tenant-schema-defer-multi-tenancy.md)'s multi-tenancy). Revisit if Lumora ever expands beyond Malaysia.
- **Wait for formal legal counsel before deciding anything.** The procedurally safest option, but this backlog has consistently favored reversible, well-reasoned interim decisions (every ADR here is Proposed, not Accepted, for exactly this reason) over blocking on a review that hasn't happened yet. A formal legal review remains genuinely valuable before Phase 1 ships — this ADR doesn't replace it.
- **Malaysia PDPA as the confirmed regulation, retention set by principle rather than an invented number (chosen).** Matches the real target market, applies PDPA's actual legal standard instead of guessing a figure the law doesn't specify, and correctly recognizes the existing child-safety design already exceeds what PDPA mandates.

## Consequences

Positive:
- Unblocks two other backlog items (audit and analytics retention) with a real legal basis instead of an invented number.
- Confirms the Azure hosting decision is legally viable — no localization blocker.
- Confirms the already-extensive child-safety design isn't legally required to go further, which is reassuring rather than limiting.

Trade-offs:
- This ADR reflects the confirmed target market and PDPA's requirements as researched on 2026-09-01 — it is **not a substitute for formal legal counsel review** before Phase 1 launch, especially since the 2024 amendment is still rolling out in stages and regulatory guidance continues to evolve.
- If Lumora's target market ever expands beyond Malaysia, this decision needs revisiting for the new market's regime (e.g. GDPR for EU users, COPPA for US users) — it does not generalize automatically.

## Review date

Revisit before Phase 1 launch with actual legal counsel review — this ADR is a solid architectural starting point, not a replacement for that review. Revisit immediately if Lumora's target market ever expands beyond Malaysia.
