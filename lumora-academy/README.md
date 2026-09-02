# Lumora Academy

Student/parent learning portal (Next.js + React). Talks to `lumora-api`.

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/en`.

## Conventions

- Routes live under `app/[lang]/` (English-only for now — see ADR-0014 in `lumora-docs`).
- Styling is Tailwind CSS v4; tokens are defined in `app/globals.css` (ADR-0013).
- Unit tests use Jest + React Testing Library via `next/jest` (ADR-0011): `npm test`.
