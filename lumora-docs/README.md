# Lumora Docs Foundation v1.0

This repository is the single source of truth for Lumora Academy documentation.

Lumora Academy is an AI-native education platform built with a documentation-driven, child-safety-first, privacy-by-design approach.

## Core stack decision

- Backend: Laravel (see [technology stack doc](docs/07-software-architecture/technology-stack.md) for exact pinned versions)
- Admin: Filament
- Frontend: Next.js + React
- Database: PostgreSQL
- Vector search: pgvector first, Qdrant later if justified
- Cache/queue: Redis
- Search: Meilisearch
- Storage: S3-compatible object storage
- AI: OpenAI + Claude through a provider abstraction layer
- Monitoring: Sentry
- Analytics: PostHog
- Hosting: Azure + Cloudflare
- Testing: Pest, PHPUnit, Playwright
- Documentation: MkDocs Material

## Local commands

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
mkdocs serve
```

Open:

```text
http://127.0.0.1:8000
```

## Repository rule

Documentation is part of the product. If a feature is not documented, it is not complete.
