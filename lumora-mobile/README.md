# Lumora Mobile

Student/parent mobile app (React Native + Expo, ADR-0026). Talks to the same
`lumora-api` the web portal uses — no separate mobile backend.

## Getting started

```bash
npm install
npm run start
```

Then press `w` for web, or scan the QR code with Expo Go for a device.

## Conventions

- File-based routing via Expo Router (`src/app/`).
- The student/parent portal (auth, curriculum browsing, assessments, AI
  Tutor chat, parent oversight) is built and requires connectivity for
  every request.
- **Offline support (ADR-0026)**: already-downloaded curriculum content
  (subjects, topics, lessons, assessments) stays viewable offline —
  `apiFetchCached` (`src/lib/api.ts`) reads through a per-key AsyncStorage
  cache (`src/lib/offline-cache.ts`), falling back to the last successful
  response when the real request fails, with an "you're offline — showing
  saved content" banner so it's never silently stale. This covers *viewing*
  only, per the ADR's own scope — mutations (mark-complete, submit an
  attempt) aren't queued for offline replay, they fail with the existing
  generic error like before; that's a real, bigger feature, not attempted
  here. The AI Tutor degrades explicitly instead: `expo-network`'s
  `useNetworkState()` gates the composer, replacing it with a clear "you're
  offline" message rather than attempting (and failing) an AI request.
- Push notifications and app-store child-directed-app compliance are still
  open (`19-mobile-platform` in `lumora-docs`).

## Continuous Integration

`.github/workflows/lumora-mobile.yml` (repo root) runs `tsc --noEmit`,
lint, and `npm test` on every push/PR touching this directory.
