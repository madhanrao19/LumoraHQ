# ADR 0006: Ratify WCAG 2.2 Level AA as the Accessibility Target

## Status

Proposed

## Context

[UI/UX Design System](../11-ui-ux-design-system/index.md#accessibility) already named WCAG 2.2 AA as a "working target," applied to both `lumora-design-system` components and the Filament admin theme, but explicitly flagged that ratifying it needs an ADR rather than resting on that book alone, since it has real cost implications. That's distinct from [Testing & QA](../14-testing-qa/index.md#accessibility)'s separate open question of which tooling enforces it — this ADR only ratifies the target, not how it's checked.

Verified before writing this (2026-09-01): WCAG 2.2 remains the current W3C Recommendation. WCAG 3.0 is still a Working Draft — its Candidate Recommendation isn't expected before Q4 2027, and a final Recommendation not before 2028. It changes the compliance model entirely (pass/fail A/AA/AAA becomes an outcomes-based Bronze/Silver/Gold score), so it isn't a target Lumora could plan against yet even if it wanted to.

## Decision

Ratify **WCAG 2.2 Level AA** as Lumora Academy's binding accessibility target, applied to both the Next.js portal (`lumora-design-system` components) and the Filament admin theme, per the [Constitution](../00-constitution/index.md#non-negotiable-principles) principle 7 (accessibility is default).

## Alternatives considered

- **WCAG 2.2 Level A only.** A lower, cheaper bar — but AA is the level most external accessibility expectations (procurement, school district requirements) actually reference in practice, and principle 7's "usable by learners with different abilities" reads as a real product requirement for a platform serving children, not a legal-minimum checkbox. A only would undersell that commitment.
- **WCAG 2.2 Level AAA.** The most stringent level — but the W3C itself doesn't recommend AAA as a general site-wide target; some AAA success criteria are acknowledged as not achievable for all content types. AA is the right target site-wide, with room to apply AAA criteria selectively to specific critical flows later if desired — that's a component-level decision, not this ADR's.
- **Wait for WCAG 3.0.** Its Candidate Recommendation isn't expected before Q4 2027 and final Recommendation not before 2028 — waiting would leave the entire platform with no ratified accessibility target through all of Phase 1 and Phase 2. Not viable.

## Consequences

Positive:
- Gives [Testing & QA](../14-testing-qa/index.md#accessibility)'s still-open tooling question a concrete target to test against, instead of an undefined bar.
- Matches what most external accessibility expectations for an education platform already reference.
- Every component in `lumora-design-system` and the Filament theme now has a clear, single bar to design and review against.

Trade-offs:
- AA-level compliance is real, ongoing engineering and design cost — color contrast, keyboard navigation, screen-reader labeling — on every component, not a one-time setup task.

## Review date

Revisit when WCAG 3.0 reaches Candidate Recommendation status (not expected before Q4 2027) — not sooner, since it isn't stable enough to plan against yet.
