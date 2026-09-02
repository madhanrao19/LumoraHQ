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
- Offline support will cover already-downloaded content only; the AI Tutor
  requires connectivity and degrades explicitly (ADR-0026) — not built yet.
- Push notifications and app-store child-directed-app compliance are still
  open (`19-mobile-platform` in `lumora-docs`).
