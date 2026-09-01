# LumoraHQ

Monorepo for **Lumora Academy** — an AI-native education platform built with a
documentation-driven, child-safety-first, privacy-by-design approach.

This repository consolidates the Lumora workspace: the documentation (the current
source of truth) plus scaffolding for each application and service.

## Repository layout

| Directory | Status | Purpose |
|---|---|---|
| [`lumora-docs/`](lumora-docs/) | ✅ Populated | Single source of truth — MkDocs Material site covering vision, strategy, architecture, curriculum, ADRs, playbooks, and runbooks. |
| [`lumora-api/`](lumora-api/) | 🟡 Placeholder | Laravel backend API. |
| [`lumora-academy/`](lumora-academy/) | 🟡 Placeholder | Student/parent learning portal — Next.js + React. |
| [`lumora-ai/`](lumora-ai/) | 🟡 Placeholder | AI services and the OpenAI/Claude provider abstraction layer. |
| [`lumora-design-system/`](lumora-design-system/) | 🟡 Placeholder | Shared UI components and design tokens. |
| [`lumora-mobile/`](lumora-mobile/) | 🟡 Placeholder | Mobile application. |
| [`lumora-knowledge/`](lumora-knowledge/) | 🟡 Placeholder | Curriculum content and knowledge base data. |
| [`lumora-infrastructure/`](lumora-infrastructure/) | 🟡 Placeholder | Infrastructure as code and deployment (Azure + Cloudflare). |
| [`lumora-labs/`](lumora-labs/) | 🟡 Placeholder | Experiments and prototypes. |
| [`lumora-public/`](lumora-public/) | 🟡 Placeholder | Public-facing site and assets. |

> 🟡 **Placeholder** folders currently hold only a `.gitkeep`. Purposes are the
> intended scope inferred from naming — adjust as each subproject is defined.

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
