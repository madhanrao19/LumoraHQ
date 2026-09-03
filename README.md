# LumoraHQ

Monorepo for **Lumora Academy** — an AI-native education platform built with a
documentation-driven, child-safety-first, privacy-by-design approach.

This repository consolidates the Lumora workspace: the documentation (the current
source of truth) plus scaffolding for each application and service.

## Repository layout

| Directory | Status | Purpose |
|---|---|---|
| [`lumora-docs/`](lumora-docs/) | ✅ Populated | Single source of truth — MkDocs Material site covering vision, strategy, architecture, curriculum, ADRs, playbooks, and runbooks. |
| [`lumora-api/`](lumora-api/) | ✅ Populated | Laravel backend API — curriculum, lesson, question, and assessment engines; AI Gateway with tiered routing and full audit logging; AI Tutor with real-time safety classification (ADR-0023) and RAG-grounded scope (ADR-0028); Admin portal via Filament (content lifecycle, read-only audit-log resource). 68 Pest tests passing. |
| [`lumora-academy/`](lumora-academy/) | ✅ Populated | Student/parent learning portal — Next.js + React. Auth, curriculum browsing, lesson completion, assessment-taking, AI Tutor chat; Parent-facing student management, progress/attempts, Tutor conversation, and AI Gateway audit-log oversight. |
| [`lumora-ai/`](lumora-ai/) | 🟡 Placeholder | Purpose not yet assigned — the AI Gateway (OpenAI/Claude provider abstraction) lives in `lumora-api`, not here (ADR-0015, ADR-0016). |
| [`lumora-design-system/`](lumora-design-system/) | 🟡 Placeholder | Shared UI components and design tokens. |
| [`lumora-mobile/`](lumora-mobile/) | ✅ Populated | Mobile application — React Native + Expo. Same feature set as `lumora-academy` (student/parent portal), ported to native conventions (ADR-0026). |
| [`lumora-knowledge/`](lumora-knowledge/) | 🟡 Placeholder | Curriculum content and knowledge base data. |
| [`lumora-infrastructure/`](lumora-infrastructure/) | 🟢 Scaffolded | Azure Bicep for App Service, Key Vault, PostgreSQL, and Redis — compiles clean with `az bicep build`, not yet deployed to a real subscription. |
| [`lumora-labs/`](lumora-labs/) | 🟡 Placeholder | Experiments and prototypes. |
| [`lumora-public/`](lumora-public/) | 🟡 Placeholder | Public-facing site and assets. |

> 🟡 **Placeholder** folders currently hold only a `.gitkeep`. Purposes are the
> intended scope inferred from naming — adjust as each subproject is defined.
> 🟢 **Scaffolded** folders have a working project skeleton (dependencies installed, tests passing) but no application features yet.

## Technology stack

Per [ADR-0001](lumora-docs/docs/21-adr/0001-use-laravel-filament-postgresql.md)
and the [technology stack doc](lumora-docs/docs/07-software-architecture/technology-stack.md):

| Layer | Technology |
|---|---|
| Backend | Laravel |
| Admin portal | Filament |
| Student/parent portal | Next.js + React |
| Database | PostgreSQL (pgvector for vector search) |
| Cache & queue | Redis |
| Search | Meilisearch |
| Storage | S3-compatible object storage |
| AI providers | OpenAI + Claude via abstraction layer |
| Auth | Laravel Sanctum |
| Monitoring / analytics | Sentry, PostHog |
| Hosting / CDN | Azure, Cloudflare |
| Testing | Pest, PHPUnit, Playwright |
| Documentation | MkDocs Material |

**Architecture strategy:** start as a modular monolith; split services only when
scale, team boundaries, performance, or reliability justify it.

## Getting started

### Documentation site

```powershell
cd lumora-docs
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
mkdocs serve
```

Then open http://127.0.0.1:8000.

## Conventions

- **Documentation is part of the product.** If a feature is not documented, it is
  not complete.
- **Decisions are traceable** through ADRs in
  [`lumora-docs/docs/21-adr/`](lumora-docs/docs/21-adr/).
- **Child safety, privacy, accessibility, and accuracy** come first in every
  decision.
- Environment files, virtualenvs, build output, and local editor/Claude settings
  are ignored — see [`.gitignore`](.gitignore).
