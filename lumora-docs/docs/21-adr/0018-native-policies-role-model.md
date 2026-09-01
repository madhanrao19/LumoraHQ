# ADR 0018: Fixed Role Set with Native Laravel Policies, Not a Permission Package

## Status

Accepted

## Context

[Security & Privacy](../12-security-privacy/index.md#applicable-regulation) flagged the role/permission model as open, noting the role set is "not yet defined beyond what the Roadmap implies (student, parent, admin at minimum for Phase 1; teacher for Phase 3's 'Teacher tools')." This ADR decides the role set and the authorization *mechanism* — it does not decide the parent-child account relationship data model, which stays a separate open item ([Security & Privacy](../12-security-privacy/index.md#applicable-regulation)).

## Decision

1. **Fixed role set for Phase 1: Student, Parent, Admin.** Stored as a role attribute on the Identity & Access module's user records. Teacher is added in Phase 3 when Teacher tools actually ships — not created speculatively now.
2. **Authorization uses Laravel's native Policy classes**, one per protected model — not a third-party permission package (e.g. `spatie/laravel-permission`). A Policy method checks whatever the specific rule requires: a role check (e.g. "is Admin"), or a relationship/ownership check (e.g. "is this Parent linked to this Student"), in the same mechanism, with no separate system needed for the two different kinds of checks.
3. **The Admin portal (Filament) reuses the exact same Policy classes automatically** — Filament resources respect Laravel Policies out of the box, so there's no separate admin-permission system to build.

## Alternatives considered

- **A third-party permission package** (`spatie/laravel-permission` or similar). The standard choice when roles and permissions are numerous and end-user-configurable — an admin composing custom roles from granular permissions at runtime. Lumora's role set is small, fixed, and known upfront (Student/Parent/Admin, Teacher later), not something anyone configures dynamically. Adopting a package built for a dynamic-permission problem Lumora doesn't have would be the same kind of unrequested abstraction already avoided elsewhere — [ADR-0004](0004-github-flow-branching-and-commit-conventions.md), [ADR-0007](0007-azure-key-vault-secret-manager.md), and [ADR-0008](0008-three-environment-topology.md) all rejected building for a need that isn't real yet.
- **A fully custom ACL system built from scratch.** Reinvents what Laravel's Policy classes already provide for free — the same "use the framework default" reasoning already applied in [ADR-0005](0005-laravel-default-api-conventions.md), [ADR-0007](0007-azure-key-vault-secret-manager.md), and [ADR-0011](0011-jest-frontend-unit-testing.md).
- **Native Laravel Policies with a fixed, Roadmap-derived role set (chosen).** Matches the actual known role set, expresses both role and ownership checks in one mechanism, and gets Filament's admin authorization for free from the same Policies.

## Consequences

Positive:
- Zero new dependency.
- One mechanism (Policies) handles both role checks and relationship/ownership checks — including the parent-child access pattern [AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md) requirement 6 already requires, once that data model is decided.
- Filament admin authorization comes free from the same Policy classes — no parallel system to build or keep in sync.

Trade-offs:
- If Lumora eventually needs many more roles or admin-configurable permission sets — for example, if Phase 3's "School edition" wants school admins to customize staff permissions — a permission package may become genuinely justified then. This ADR doesn't rule that out; it just doesn't adopt one speculatively now. Policies and a permission package aren't mutually exclusive, so revisiting later is cheap, not a rewrite.

## Review date

Revisit when a Phase 3 requirement introduces genuinely dynamic or admin-configurable roles/permissions — not before, since the current role set is small and fixed.
