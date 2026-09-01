# ADR 0002: Use Token-Based Sanctum Authentication for All Clients

## Status

Proposed

## Context

[API Architecture](../10-api-architecture/index.md#authentication) already decided Laravel Sanctum handles authentication, but left open which of Sanctum's two modes to use: SPA cookie-based auth, or bearer-token auth.

Two facts already established elsewhere narrow this down:

- The Student/Parent Portal (Next.js) is the API's primary consumer today, but a mobile app is explicit Roadmap Phase 3 scope, not a hypothetical — [API Architecture](../10-api-architecture/index.md#who-calls-the-api) already states the API "must not assume web-only."
- Cookie-based SPA auth only works cleanly when the SPA and API share a site/domain relationship. A native mobile client can't participate in that flow — it would need bearer-token auth regardless of what the web portal uses.

The question is whether to build one auth path now (token-based, used by every client including the web portal) or build cookie-based auth for the web portal today and add a second, token-based path when mobile arrives in Phase 3.

## Decision

Use Sanctum's token-based (API token) authentication for **all** clients from day one, including the Next.js portal — not cookie-based SPA auth.

## Alternatives considered

- **Cookie-based SPA auth for the web portal now, add token auth later for mobile.** Simpler for the web-only case today (built-in CSRF protection, no client-side token storage to manage) — but means building and maintaining two authentication paths through the same API once mobile lands, and the second path isn't built until Phase 3, i.e. after the first path is already load-bearing and harder to change around.
- **Support both modes from day one.** Avoids ever needing a second path later, but means building and testing two authentication systems before there's a second real client to justify it — more upfront complexity for a need that doesn't exist yet.
- **Token-based for all clients (chosen).** One path, works identically for the web portal today and mobile later. The web portal takes on token storage/handling responsibility it wouldn't need with cookies, but that cost is paid once, not twice.

## Consequences

Positive:
- Single authentication path across every current and future client — no second system to design when mobile work starts.
- No CSRF middleware needed for the API itself, since token auth doesn't rely on ambient cookies.

Trade-offs:
- The Next.js portal must handle token storage carefully — naive storage (e.g. `localStorage`) is vulnerable to XSS token theft. The specific storage/refresh mechanism (e.g. in-memory token plus a secure refresh flow) is a follow-up decision for [Development Standards](../08-development-standards/index.md) once Phase 1 auth work starts; this ADR decides the mode, not the storage mechanism.
- Slightly more client-side complexity for the web portal than a cookie session would require, paid starting now rather than only when mobile arrives.

## Review date

Revisit if Phase 1 implementation reveals token handling complexity that outweighs the benefit before mobile exists — otherwise, re-confirm this decision when Phase 3 mobile work actually starts.
