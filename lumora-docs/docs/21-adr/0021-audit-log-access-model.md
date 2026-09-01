# ADR 0021: Audit Log Access via Existing Policies; Retention Duration Stays Open

## Status

Accepted

## Context

[Security & Privacy](../12-security-privacy/index.md#audit-accountability) states every AI Gateway request/response is logged ([AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md) requirement 3) but leaves both **who can read that log** and **how long it's retained** undecided. Three things now exist to build access on: [ADR-0018](0018-native-policies-role-model.md) decided authorization via native Laravel Policies checking role and relationship; [ADR-0019](0019-parent-initiated-child-accounts.md) established the parent-student link table that requirement 6 (parent visibility) depends on; [ADR-0020](0020-four-tier-data-classification.md) classifies AI interaction logs as Sensitive/Child data.

This ADR deliberately splits the original question in two. **Access** is an architecture decision this project can make now, using mechanisms already in place. **Retention duration** is fundamentally a compliance/legal-retention-schedule question — unlike [ADR-0010](0010-backup-retention-and-dr-targets.md)'s PostgreSQL backup window (a technical recovery-point decision grounded in Azure's actual platform mechanics), an audit-log retention *period* should be set once [Security & Privacy](../12-security-privacy/index.md#applicable-regulation)'s "applicable privacy regulation(s)" item resolves, since that answer determines both minimum and maximum retention requirements. Pinning a number now would present an invented compliance commitment as though it were considered and correct.

## Decision

**Access** uses the same Policy mechanism [ADR-0018](0018-native-policies-role-model.md) already decided — no new authorization system:

- **Admin:** full read access to the audit log, for safety review, moderation investigation, and compliance purposes.
- **Parent:** read access scoped to only their own linked student's AI interactions, enforced via the parent-student relationship from [ADR-0019](0019-parent-initiated-child-accounts.md) — the same ownership-check pattern already used for other parent-facing data.
- **Student:** no direct access to "the audit log" as an accountability feature. This is distinct from an ordinary chat-history UI (a normal, unrestricted product feature showing a student their own past conversations) — the audit log exists for oversight, not as something the subject of the record accesses or interprets, so its access model is Admin and Parent only.

**Retention duration is explicitly not decided here.** The qualitative principle: retain logs at least as long as the associated account is active (ongoing safety oversight needs the trail while a child is using the product), and don't retain indefinitely after account deletion. The exact window is deferred to when the applicable-regulation question resolves.

## Alternatives considered

- **A separate, bespoke permission system for audit log access.** Would duplicate the Policy-based mechanism [ADR-0018](0018-native-policies-role-model.md) already established for exactly this kind of role-plus-relationship check — no reason to build a second system when the first already fits.
- **Give students direct access to "their" audit log entries.** Conflates two different things: a student's own chat history (an ordinary, unrestricted product feature) and the accountability audit trail (built for oversight, not for the subject of the record to control). Keeping them separate avoids that conflation and preserves the audit trail's integrity purpose.
- **Pin a specific retention duration now** (e.g. "2 years"). Tempting for completeness, but unlike ADR-0010's backup-retention number — grounded in real Azure platform mechanics, an operational choice — an audit-log retention schedule is a legal/compliance decision this project has no grounding to make while the applicable regulation is still undecided.

## Consequences

Positive:
- Zero new authorization code — reuses [ADR-0018](0018-native-policies-role-model.md)'s Policy mechanism directly.
- Directly satisfies Safety Principle 6's parent-visibility requirement while keeping the audit log's oversight purpose separate from a student-facing feature.

Trade-offs:
- Retention duration remains genuinely open, so the full audit-log lifecycle policy isn't complete — deletion/archival mechanics can't be built until the regulation question resolves. This ADR only unblocks the access-control half of the original backlog item.

## Review date

Revisit retention duration once [Security & Privacy](../12-security-privacy/index.md#applicable-regulation)'s "applicable privacy regulation(s)" item is resolved. The access-control decision here doesn't need revisiting on that basis — it's independent of jurisdiction.
