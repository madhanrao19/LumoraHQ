# ADR 0014: English-Only Launch, with Next.js's Native Locale Route Scaffold from Day One

## Status

Proposed

## Context

[UI/UX Design System](../11-ui-ux-design-system/index.md#language) flagged UI language/locale strategy as open — neither "single language at launch vs. multi-language" nor an i18n framework was decided, and [Constitution](../00-constitution/index.md#non-negotiable-principles) principle 7 requires the product to be "usable by learners with different... languages" as a default, not an afterthought.

Two facts narrow this down. First, the [Roadmap](../25-roadmap/index.md) Phase 1 scope (authentication, roles, curriculum/lesson/question-bank/assessment engines, student/parent/admin portals) does not name multi-language support as a requirement — it isn't a real, scheduled need yet. Second, verified before writing this (2026-09-01): Next.js's App Router ships **no built-in i18n solution**. Its own official guide documents a native pattern — nesting all routes under an `app/[lang]/` segment, with locale-keyed "dictionary" files loaded server-side — and separately lists third-party libraries (next-intl being the most established of those listed) as optional additions on top of that pattern, not a replacement for it.

## Decision

1. **Launch Phase 1 with English as the sole supported UI language.** No third-party i18n library (next-intl or otherwise) is adopted yet — multi-language isn't a named Phase 1 requirement, so translation-management tooling and ongoing per-string maintenance would be pure cost for content nobody will read yet.
2. **Structure the Next.js App Router using its native `[lang]` route-segment pattern from day one**, even with only `en` as the single registered locale. This costs nothing today — it's framework-native, adds no dependency — and avoids the expensive alternative: retrofitting every route and URL after launch to add a locale segment, which would break existing bookmarks, deep links, and SEO.
3. **Defer the i18n library choice** until multi-language becomes an actual scheduled requirement. Pick then, informed by whatever real localization needs exist at that point, rather than guessing now.

## Alternatives considered

- **Adopt a full i18n library (e.g. next-intl) now, even for single-language launch.** Gives translation-management tooling ready to go, but adds real dependency and configuration overhead, plus ongoing per-string maintenance burden, for a requirement that isn't in the Roadmap yet. Premature.
- **Flat routes with no `[lang]` segment, defer localization structure entirely.** Cheapest right now — but the URL *structure* is the one piece that's genuinely expensive to retrofit later (breaking bookmarks, deep links, and SEO), unlike the library choice, which can be bolted onto the dictionary pattern later without touching routes at all.
- **Native `[lang]` scaffold, English-only, no library yet (chosen).** Gets the one genuinely expensive-to-retrofit piece (URL structure) right from day one at zero cost, while deferring the one genuinely premature piece (translation tooling and content) until it's a real, scheduled requirement.

## Consequences

Positive:
- URL structure never needs a breaking change later, no matter when (or whether) multi-language actually arrives.
- Zero added dependency or maintenance cost today.
- Still meets the Constitution's "different languages" default — the door is open, not closed, without over-investing before it's needed.

Trade-offs:
- Every route threads a `[lang]` param even though only one locale exists today — a small, permanent bit of structural overhead a flat-route setup wouldn't have. If multi-language is genuinely never pursued, this was mild unnecessary overhead — accepted because the alternative failure mode (retrofitting URLs post-launch) is worse.

## Review date

Revisit the i18n library choice once multi-language becomes an actual named Roadmap item — not before.
