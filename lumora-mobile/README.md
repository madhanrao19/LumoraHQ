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
- **Offline support is not built yet.** ADR-0026 calls for already-downloaded
  lessons/assessments to stay viewable offline (syncing opportunistically
  when connectivity returns), and for the AI Tutor to show an explicit
  "you're offline" message rather than any offline AI fallback — today a
  lost connection just surfaces the same generic error message every fetch
  failure does.
- Push notifications and app-store child-directed-app compliance are still
  open (`19-mobile-platform` in `lumora-docs`).

## Continuous Integration

`.github/workflows/lumora-mobile.yml` (repo root) runs `tsc --noEmit`,
lint, and `npm test` on every push/PR touching this directory.
