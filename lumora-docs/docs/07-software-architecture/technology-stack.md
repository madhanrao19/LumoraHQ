# Technology Stack

## Official foundation stack

Exact versions are tracked **only here** — every other document links to this page rather than restating a version number, so there's one place to update instead of several going stale independently.

| Layer | Technology | Version |
|---|---|---|
| Backend | Laravel | v13.30.0 — installed in `lumora-api/composer.lock`, verified directly |
| Admin Portal | Filament | v5.7.8 |
| Student/Parent Portal | Next.js + React | Next.js v16.3.4, React v19.2.8 |
| Database | PostgreSQL | 18 (current minor 18.6) |
| Vector Search | pgvector first; Qdrant later if justified | pgvector v0.8.6 |
| Cache & Queue | Redis | 8.10.1 |
| Search | Meilisearch | v1.53.1 |
| Storage | S3-compatible object storage | — |
| AI Providers | OpenAI + Claude through abstraction layer | — |
| Realtime | Laravel Reverb where appropriate | v1.11.1 |
| Auth | Laravel Sanctum | v4.3.3 |
| Monitoring | Sentry | — |
| Analytics | PostHog | — |
| Observability | OpenTelemetry | — |
| CDN | Cloudflare | — |
| Hosting | Azure | — |
| Testing | Pest, PHPUnit, Playwright | Pest v4.7.8, PHPUnit 12.5.34 (Pest's resolved dependency) — installed in `lumora-api/composer.lock`, verified directly; Playwright v1.62.1 — planning reference, not yet installed |
| Documentation | MkDocs Material, mkdocs-mermaid2-plugin | 9.7.6, 1.2.3 — installed in `lumora-docs/.venv`, verified directly rather than looked up |

Versions above marked "verified directly" come from an actual installed lockfile (`lumora-api/composer.lock`, `lumora-docs/.venv`), checked 2026-09-01 — trust these over anything below. Everything else is still a planning reference checked against each project's official release channel on the same date, not yet installed; re-verify before pinning, since these move fast enough that "latest" drifts within weeks. Note Pest v4.7 resolves PHPUnit 12.5.34 as its actual runtime dependency, not the 13.x line — Composer's own dependency resolution is the authority here, not a general web check.

Entries with no version (S3-compatible storage, AI providers, Sentry, PostHog, OpenTelemetry, Cloudflare, Azure) are platforms/services consumed via their own independently-versioned SDKs or with no single "product version" to pin — not an oversight.

## Architecture strategy

Start as a modular monolith. Do not start with microservices. Split services only when scale, team boundaries, performance, or reliability justify it.
