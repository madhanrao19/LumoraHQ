# ADR 0026: React Native with Expo for Mobile; Offline Covers Downloaded Content, Not the AI Tutor

## Status

Accepted

## Context

[Mobile Platform](../19-mobile-platform/index.md#not-yet-decided) flagged mobile framework and offline support strategy as open — Roadmap Phase 3, not urgent, but real questions worth resolving with a real answer rather than leaving empty. [API Architecture](../10-api-architecture/index.md#who-calls-the-api) already designed the API to serve a future mobile client without a redesign, and [ADR-0002](0002-use-token-based-sanctum-authentication.md) already chose token-based auth specifically because it works for a native client, not just the web portal — mobile was already planned for, just not yet decided which framework.

Verified before writing this (2026-09-01): React Native's own team officially recommends Expo as "the only recommended community framework for React Native," and the ecosystem in 2026 is described as mature — the New Architecture delivering on its performance promises, with native-performance gaps that don't matter for the vast majority of apps.

## Decision

1. **Mobile framework: React Native with Expo.** Not Flutter, not separate native (Swift/Kotlin) apps.
2. **The mobile app consumes the same API the web portal already uses** — no separate mobile-specific backend. This is exactly what [ADR-0002](0002-use-token-based-sanctum-authentication.md)'s token-based auth choice was made for.
3. **Offline support covers already-downloaded content only** — lessons and assessments already fetched remain viewable/usable without connectivity, syncing opportunistically when connectivity returns. **The AI Tutor requires connectivity and degrades explicitly** (clear "you're offline" messaging) rather than attempting any offline AI fallback — consistent with [AI Agents Handbook](../16-ai-agents-handbook/index.md#two-different-safety-models-not-one)'s real-time safety model, which has no meaning without a live connection to the AI Gateway.

## Alternatives considered

- **Flutter.** Also mature and cross-platform with a single codebase, but introduces Dart — a second language and ecosystem the team doesn't otherwise need, when React Native lets the same React/JavaScript skillset and even some component logic carry over from the already-built web portal. The same "don't introduce an unnecessary second skillset" reasoning [ADR-0011](0011-jest-frontend-unit-testing.md) already applied against adding Vite purely for tests.
- **Fully native (separate Swift/Kotlin apps).** Best possible per-platform performance and polish, but doubles the engineering surface — two codebases, two skillsets — for a small team, with no requirement identified yet that actually needs it.
- **React Native with Expo (chosen).** Reuses the team's existing React investment, is the framework's own officially recommended toolchain, and shares real logic and patterns with the web portal already built.

## Consequences

Positive:
- No new language or skillset required beyond what the web portal already needs.
- Expo's mature toolchain reduces native-build complexity that bare React Native would otherwise carry.
- Reuses the exact same API and auth mechanism already decided — no parallel backend to build or maintain.

Trade-offs:
- React Native/Expo trades a small amount of native performance and platform-specific polish versus fully native apps — accepted, since current framework maturity makes this gap negligible for the vast majority of apps at this scale.
- Offline mode explicitly does not extend to AI features. This is a real, visible product limitation — students need to understand offline mode covers already-downloaded content only, not the Tutor — not a silent gap discovered later.

## Review date

Revisit only if a specific platform-performance requirement emerges that React Native/Expo genuinely can't meet — rare given current framework maturity, and not something to anticipate before Phase 3 mobile work actually starts and reveals a real limitation.
