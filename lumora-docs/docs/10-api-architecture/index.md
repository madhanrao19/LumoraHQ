# API Architecture

## Purpose

This book defines how clients talk to the Laravel backend: which clients use the API, how they authenticate, and the conventions that keep the API consistent as modules and clients grow.

It does not define the full endpoint catalog yet — see [Status](#status).

## Status

Version: 1.1 foundation draft. Establishes API principles and the auth/versioning questions that must be answered before Phase 1 endpoints are built. No endpoint catalog exists yet.

## Who calls the API

Per [Software Architecture](../07-software-architecture/index.md#system-overview):

| Client | Talks to the API? |
|---|---|
| Student/Parent Portal (Next.js) | Yes — this is the API's primary consumer. |
| Admin Portal (Filament) | Mostly no — Filament runs inside the same Laravel application and can call module services directly without an HTTP hop. It only uses the public API where it needs the same contract an external client would use. |
| Mobile app (Roadmap Phase 3) | Yes, later — the API must not assume "web-only" so this doesn't force a breaking redesign. |
| Public site (`lumora-public`) | Only for content that's meant to be public; never for authenticated data. |

This matters for scope: the API is designed for the student/parent portal and future mobile client first. Admin operations that only Filament ever calls don't need to be shaped as public API endpoints.

## Authentication

Laravel Sanctum is the decided mechanism ([Technology Stack](../07-software-architecture/technology-stack.md)). Sanctum supports two modes and **which mode(s) Lumora Academy uses is not yet decided**:

- SPA cookie-based auth (simplest, requires portal and API on a related domain/same-site).
- Bearer token auth (works cross-origin, needed for a future mobile app regardless).

!!! note "Not yet decided"
    Whether the Next.js portal uses cookie-based or token-based Sanctum auth, and whether the API should support both from day one so the mobile app (Phase 3) doesn't require a second auth path. Resolve as an ADR before Phase 1 auth work starts.

## Core conventions

These apply regardless of which module an endpoint belongs to:

- **JSON in, JSON out.** No server-rendered views from API endpoints — that's Filament's job, not the API's.
- **Versioned from the start** (e.g. a `/api/v1/` prefix), because the API will eventually serve a mobile client it doesn't control the release cadence of. Breaking a mobile app in the field is worse than breaking a web deploy.
- **Consistent error shape** across every endpoint — a client should be able to handle errors generically instead of per-endpoint.
- **Consistent pagination** for any list endpoint (curriculum lists, question banks, notifications, etc.) rather than each module inventing its own.
- **Endpoints reflect module boundaries**, not database tables. A response can combine or reshape data from a module — the API contract is not required to mirror [Database Architecture](../09-database-architecture/index.md) table-for-table.

Exact conventions (envelope format, error codes, pagination style) are not yet chosen — they should be decided once, written down here, and then followed by every module rather than re-decided per endpoint.

## The AI Gateway boundary

AI-touching endpoints (Phase 2) carry requirements the rest of the API doesn't, straight from [AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md):

- Clients never call an AI provider directly or receive a raw provider response — every AI-touching request goes through the AI Gateway module, which is the only thing allowed to call OpenAI/Claude (also stated in [Software Architecture](../07-software-architecture/index.md#cross-cutting-principles)).
- Every AI Gateway request/response must be logged for audit (safety principle 3) — this is an API-level requirement, not optional per-endpoint behavior.
- AI-generated educational content is returned as a **draft**, never as published content, until a human review step approves it (safety principle 2) — the API must be able to represent that draft/published distinction, not just return content as final.
- Provider errors, rate limits, and internal prompt details must not leak into the client-facing error shape.

## Scope boundaries

| Topic | Owned by |
|---|---|
| Module boundaries these endpoints route into | [Software Architecture](../07-software-architecture/index.md) |
| Underlying table shape (may differ from response shape) | [Database Architecture](../09-database-architecture/index.md) |
| Controller/service coding conventions | [Development Standards](../08-development-standards/index.md) |
| Authorization rules, rate limiting, threat model | [Security & Privacy](../12-security-privacy/index.md) |
| AI safety requirements endpoints must satisfy | [AI Development Bible](../06-ai-development-bible/index.md) |
| API test strategy and coverage | [Testing & QA](../14-testing-qa/index.md) |

## Related documents

- [Software Architecture](../07-software-architecture/index.md) — the modules this API exposes.
- [Database Architecture](../09-database-architecture/index.md) — the data these endpoints read and write.
- [AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md) — binding rules for any AI-touching endpoint.
- [Roadmap](../25-roadmap/index.md) — the phase this API is built to support.
