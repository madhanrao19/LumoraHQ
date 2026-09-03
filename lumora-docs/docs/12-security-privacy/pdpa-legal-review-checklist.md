# Legal Review Checklist — Malaysia PDPA

## Purpose

[ADR-0029](../21-adr/0029-malaysia-pdpa-applicable-regulation.md) made a reasoned interim architectural decision — Malaysia's PDPA applies, retention is principle-based — without formal legal counsel. That ADR is explicit it is "not a substitute for formal legal counsel review before Phase 1 launch." This page is the checklist for that review: every place this project's own documents already flagged something as depending on real legal confirmation, in one list, so the review can start from what's already been reasoned through instead of a blank page.

This is not new legal analysis. Every item below quotes or paraphrases a decision or caveat already on record; nothing here is invented for this checklist.

## What's already decided, needing confirmation not origination

1. **Malaysia's PDPA (2010, as amended 2024) is the correct and only applicable regime.** [ADR-0029](../21-adr/0029-malaysia-pdpa-applicable-regulation.md) confirms this based on a Malaysia-only target market — confirm that's still the actual go-to-market plan, and that no other jurisdiction's regime (GDPR, COPPA) attaches for any reason (e.g. hosting location, an EU/US user segment).
2. **PDPA's Retention Principle is genuinely disposal-based, not a fixed statutory period**, and the 2024 amendment doesn't change that. Confirm this reading is still accurate given the amendment is "still rolling out in stages" as of ADR-0029's writing (2026-09-01).
3. **PDPA has no COPPA/GDPR-Article-8-style special children's-data provision.** Confirm this remains true, and confirm the existing child-safety design (parent-initiated accounts, Sensitive/Child data classification, parent-scoped audit access — [ADR-0019](../21-adr/0019-parent-initiated-child-accounts.md), [ADR-0020](../21-adr/0020-four-tier-data-classification.md), [ADR-0021](../21-adr/0021-audit-log-access-model.md)) is legally sufficient, not just product-reasonable.
4. **Cross-border hosting on Azure is legally viable under PDPA Section 129** (adequacy assessment, consent, contractual necessity, or standard contractual safeguards), with no data-localization mandate. Confirm which of those mechanisms Lumora actually needs to implement (e.g. does the Azure Data Processing Addendum already cover this, or does a specific consent flow or contract clause need to exist).

## What's decided in principle but not yet built, and needs a concrete number

5. **Audit-log retention window** ([ADR-0021](../21-adr/0021-audit-log-access-model.md)): retain while the account is active, purge Sensitive/Child data within a bounded window after account deletion. ADR-0021 suggests 30–90 days as an example, not a legal minimum. Confirm an actual number, and confirm whether "bounded window" needs to account for anything else (e.g. a backup-rotation floor from [ADR-0010](../21-adr/0010-backup-retention-and-dr-targets.md)'s 35-day PITR window).
6. **Analytics retention window** ([ADR-0025](../21-adr/0025-analytics-event-categories-default-anonymized.md)): same open question, same principle, no number picked yet — analytics isn't built yet either, so this is lower urgency than 5.
7. **Account-deletion feature doesn't exist yet.** There's no mechanism today to purge anything on deletion, because there's no way to delete an account. This is engineering work gated on #5's number, not a legal question, but it's the thing that makes #5 real rather than theoretical — flagging so it doesn't get lost.

## Other things this project's own docs have named as needing a decision

8. **Registration/DPO obligations.** PDPA may require a registered Data User Forum registration or similar depending on Lumora's data-processing volume/nature — not evaluated anywhere in this project's documents. Needs original legal input, not just confirmation.
9. **Consent and age-gating design specifics.** [ADR-0029](../21-adr/0029-malaysia-pdpa-applicable-regulation.md)'s context notes this is "affected" by the applicable-regulation decision but doesn't itself design a consent flow. Confirm the parent-initiated-account model ([ADR-0019](../21-adr/0019-parent-initiated-child-accounts.md)) satisfies PDPA's consent requirements as-is, or flag what's missing.
10. **Any mandatory-reporting obligation** if the AI Tutor's escalation mechanism ([ADR-0023](../21-adr/0023-tutor-realtime-escalation-mechanism.md)) ever surfaces a genuine child-safety risk signal (self-harm, abuse disclosure, etc.) — does Malaysian law impose a reporting duty in that circumstance, and if so, does the current design (notify linked parents + admins, no external reporting) need to change? This overlaps with the [safety-policy questionnaire](../16-ai-agents-handbook/tutor-safety-policy-questionnaire.md) — whoever owns that content decision needs this legal answer as an input, not the other way around.

## Not in scope for this review

- Retention *numbers* for anything not listed above — nothing else in this codebase currently stores Personal or Sensitive/Child data with an open retention question.
- Re-deciding anything [ADR-0018](../21-adr/0018-native-policies-role-model.md) or [ADR-0019](../21-adr/0019-parent-initiated-child-accounts.md) already settled about the role model or parent-child relationship structure — those aren't regulation-dependent per [ADR-0021](../21-adr/0021-audit-log-access-model.md)'s own reasoning, only their sufficiency under PDPA (item 3) is in scope here.

## Related documents

- [ADR-0029](../21-adr/0029-malaysia-pdpa-applicable-regulation.md) — the interim decision this checklist reviews.
- [ADR-0021](../21-adr/0021-audit-log-access-model.md), [ADR-0025](../21-adr/0025-analytics-event-categories-default-anonymized.md) — the two retention items (5, 6).
- [Tutor Safety Policy Questionnaire](../16-ai-agents-handbook/tutor-safety-policy-questionnaire.md) — the companion Tier-0 document for the AI Tutor's safety-classifier content, with its own overlap point (10) into this checklist.
