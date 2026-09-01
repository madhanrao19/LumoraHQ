# Technology Stack

## Official foundation stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12 |
| Admin Portal | Filament |
| Student/Parent Portal | Next.js + React |
| Database | PostgreSQL |
| Vector Search | pgvector first; Qdrant later if justified |
| Cache & Queue | Redis |
| Search | Meilisearch |
| Storage | S3-compatible object storage |
| AI Providers | OpenAI + Claude through abstraction layer |
| Realtime | Laravel Reverb where appropriate |
| Auth | Laravel Sanctum |
| Monitoring | Sentry |
| Analytics | PostHog |
| Observability | OpenTelemetry |
| CDN | Cloudflare |
| Hosting | Azure |
| Testing | Pest, PHPUnit, Playwright |

## Architecture strategy

Start as a modular monolith. Do not start with microservices. Split services only when scale, team boundaries, performance, or reliability justify it.
