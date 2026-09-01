# ADR 0005: Use Laravel's Default JSON Conventions for the API Envelope, Errors, and Pagination

## Status

Proposed

## Context

[API Architecture](../10-api-architecture/index.md#core-conventions) already requires "a consistent error shape across every endpoint" and "consistent pagination for any list endpoint," decided once rather than per-endpoint — but left the exact envelope/error/pagination format open.

Laravel 12 (the decided backend, [ADR-0001](0001-use-laravel-filament-postgresql.md)) already ships default conventions for exactly this: Eloquent API Resources wrap a response in a `data` key by default, the default paginator emits `data`/`links`/`meta`, and the default exception handler returns `{"message": ..., "errors": {...}}` for validation failures (422) and `{"message": ...}` for other exceptions. [Development Standards](../08-development-standards/index.md#code-style) already established the reasoning this ADR reuses: "default to each stack's standard tool rather than inventing custom rules."

## Decision

Adopt Laravel's default JSON conventions as the API's envelope, error, and pagination format — no custom envelope, no external spec (e.g. JSON:API) layered on top.

- **Single resource:** `{"data": {...}}`
- **Collection (paginated):** `{"data": [...], "links": {...}, "meta": {...}}` — Laravel's default paginated resource response.
- **Validation errors (422):** `{"message": "...", "errors": {"field": ["..."]}}` — Laravel's default.
- **Other errors:** `{"message": "..."}` with the appropriate HTTP status code. Provider-specific error details never leak through — already required for AI Gateway errors specifically by [API Architecture](../10-api-architecture/index.md#the-ai-gateway-boundary); this generalizes the same discipline to every endpoint, not just AI ones.

## Alternatives considered

- **JSON:API specification compliance.** More rigid and standardized across ecosystems — useful for a public API consumed by arbitrary third parties. Adds real tooling overhead (a JSON:API-compliant serializer) for a benefit that doesn't apply yet: the API's current and near-term clients (the Next.js portal, the future mobile app) are both first-party. Revisit if Lumora ever exposes a public or partner-facing API (the Roadmap's Phase 3 "Marketplace" item might eventually need this).
- **A fully custom hand-designed envelope.** Complete control over the shape, but means writing and maintaining custom Resource/Paginator/Handler logic to override behavior Laravel already provides, for no clear benefit over the default.
- **Laravel defaults (chosen).** Zero extra code to get a consistent, well-documented shape — matches the same "default to the framework's standard tool" reasoning already applied to code style in Development Standards.

## Consequences

Positive:
- No extra package or spec compliance to adopt or maintain.
- Consistent shape "for free," well-documented in Laravel's own docs — nothing bespoke for a future contributor to learn.

Trade-offs:
- This shape is Laravel-flavored, not a cross-ecosystem standard. If Lumora later exposes a public/partner API, this decision should be revisited toward something like JSON:API rather than assumed to still fit.
- Every client (Next.js now, mobile later) needs to consistently unwrap the `data` key — this is a shared client-side convention, not just a backend detail, and should be documented wherever client API-calling code lives once it exists.

## Review date

Revisit if/when Lumora exposes a public or partner-facing API where cross-ecosystem standardization actually matters — not in scope today.
