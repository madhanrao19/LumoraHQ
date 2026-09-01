# Mobile Platform

## Purpose

This book will define Lumora Academy's mobile app — [Roadmap](../25-roadmap/index.md) Phase 3, not started. It states the one architectural constraint already in place today rather than inventing a mobile strategy ahead of when it's needed.

## Status

Version: 0.2 — pre-Phase-3 placeholder.

## What's already in place

[API Architecture](../10-api-architecture/index.md#who-calls-the-api) already designed the API to not assume a web-only client — it's versioned, and Sanctum's token-based mode (still an open choice, but an available one) works cross-origin, which a native or cross-platform mobile app will need regardless of which framework it's built with. Nothing needs to change architecturally to eventually add mobile; that decision was made early on purpose.

## Not yet decided

- Mobile framework (native iOS/Android vs. a cross-platform framework).
- Offline support strategy — relevant given the [Constitution](../00-constitution/index.md#non-negotiable-principles) principle 7 (accessibility across devices and internet conditions), which applies at least as strongly to mobile as to the web portal.
- Push notification infrastructure.
- App store distribution and review compliance for a child-directed app — app stores apply extra scrutiny and policy requirements to apps aimed at children, which is a real, distinct compliance thread from [Security & Privacy](../12-security-privacy/index.md#not-yet-decided)'s "applicable privacy regulation(s)" item and should be tracked alongside it once mobile work starts.

## Scope boundaries

| Topic | Owned by |
|---|---|
| The API constraint mobile will rely on | [API Architecture](../10-api-architecture/index.md) |
| Privacy/regulatory scope, extended to app-store child policies | [Security & Privacy](../12-security-privacy/index.md) |
| Phase sequencing | [Roadmap](../25-roadmap/index.md) |

## Related documents

- [API Architecture](../10-api-architecture/index.md#who-calls-the-api) — why mobile doesn't require an API redesign.
- [Roadmap](../25-roadmap/index.md) — Phase 3, where this book becomes active.
