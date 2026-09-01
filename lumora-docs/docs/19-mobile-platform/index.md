# Mobile Platform

## Purpose

This book will define Lumora Academy's mobile app — [Roadmap](../25-roadmap/index.md) Phase 3, not started. It states the one architectural constraint already in place today rather than inventing a mobile strategy ahead of when it's needed.

## Status

Version: 0.3 — pre-Phase-3, but framework and offline strategy now have a proposed ADR.

## What's already in place

[API Architecture](../10-api-architecture/index.md#who-calls-the-api) already designed the API to not assume a web-only client — it's versioned, and Sanctum's token-based mode ([ADR-0002](../21-adr/0002-use-token-based-sanctum-authentication.md)) was chosen specifically because it works cross-origin for a future mobile client. Nothing needs to change architecturally to eventually add mobile; that decision was made early on purpose.

**Framework and offline strategy:** [ADR-0026](../21-adr/0026-react-native-expo-mobile.md) proposes React Native with Expo, consuming the same API the web portal already uses, with offline support covering already-downloaded content only — the AI Tutor requires connectivity and degrades explicitly rather than attempting an offline fallback.

## Not yet decided

- Push notification infrastructure.
- App store distribution and review compliance for a child-directed app — app stores apply extra scrutiny and policy requirements to apps aimed at children. This is a genuinely separate compliance thread from [ADR-0029](../21-adr/0029-malaysia-pdpa-applicable-regulation.md)'s PDPA finding — app store child-directed-app policies (Apple/Google) aren't set by Malaysian law and stay open, to be tracked once mobile work actually starts.

## Scope boundaries

| Topic | Owned by |
|---|---|
| The API constraint mobile will rely on | [API Architecture](../10-api-architecture/index.md) |
| Privacy/regulatory scope, extended to app-store child policies | [Security & Privacy](../12-security-privacy/index.md) |
| Phase sequencing | [Roadmap](../25-roadmap/index.md) |

## Related documents

- [API Architecture](../10-api-architecture/index.md#who-calls-the-api) — why mobile doesn't require an API redesign.
- [Roadmap](../25-roadmap/index.md) — Phase 3, where this book becomes active.
