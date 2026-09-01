# ADR 0024: Curriculum Content Versioning — Supersede, Don't Overwrite

## Status

Accepted

## Context

[Curriculum Framework](../05-curriculum-framework/index.md#working-structure) flagged "curriculum taxonomy and content versioning" together as open. These need to be split. The taxonomy half — the actual subject list and grade-band structure — is a content-design question requiring domain/curriculum expertise this project doesn't have, and stays open. The versioning half — how curriculum content changes over time as it's edited or a reference curriculum updates — is architecture this ADR can decide, by reusing a pattern already established elsewhere in this docs set: mark things superseded, don't delete them (the ADR process's own `Superseded` status; the general audit-retention posture in [Security & Privacy](../12-security-privacy/index.md#audit-accountability)).

## Decision

1. **Editing published curriculum content creates a new version**, through the same draft → review → approve → publish lifecycle [Content Operations](../17-content-operations/index.md#content-lifecycle) already established for any content change. The previous version is marked **superseded**, not overwritten or deleted.
2. **Only the current (latest published, non-superseded) version is RAG-eligible.** When a new version publishes, [ADR-0022](0022-rag-indexing-on-publish.md)'s same publish/unpublish indexing trigger applies: the superseded version is removed from the RAG index at that moment, the new version is indexed. This keeps RAG's "approved = what's actually being taught right now" invariant intact automatically, without a separate mechanism.
3. **Superseded versions are retained**, not deleted — for the same reason the AI Gateway audit trail exists at all: reconstructing what an AI Tutor response was actually grounded in at a past point in time matters for safety review or a content dispute, and that's only answerable if the historical content still exists.
4. **This ADR does not decide the curriculum taxonomy** (subjects, grade bands) or how Lumora tracks alignment to a specific external reference-curriculum version. Both remain genuinely open content-design questions.

## Alternatives considered

- **Overwrite-in-place editing, no version history.** Simplest, but loses the ability to reconstruct what content an AI Tutor response was actually grounded in at a past point — exactly the kind of gap [ADR-0021](0021-audit-log-access-model.md)'s audit trail exists to prevent for AI interactions generally.
- **A dedicated content-versioning system separate from the general content lifecycle** (rich diffs, a rollback UI, etc.). More powerful, but reinvents machinery the project already has a working pattern for — the same "don't build new tooling when an existing pattern already fits" reasoning already applied in [ADR-0015](0015-prompts-as-version-controlled-code.md), [ADR-0018](0018-native-policies-role-model.md), and [ADR-0020](0020-four-tier-data-classification.md).
- **Supersede-not-delete versioning integrated with the existing publish/RAG-indexing lifecycle (chosen).** Reuses an established pattern, keeps RAG automatically synced to the current version via mechanics already decided, and gives safety/audit review exactly the historical grounding data it needs without new tooling.

## Consequences

Positive:
- No new versioning system to build — reuses a pattern already established for ADRs and the general audit-retention posture.
- RAG stays synced to only the current version automatically, via [ADR-0022](0022-rag-indexing-on-publish.md)'s existing trigger — no separate sync mechanism needed.
- Historical content is available for safety/audit review without extra engineering.

Trade-offs:
- Every edit to published content creates a new database row rather than an in-place update, so curriculum tables grow over time with superseded rows — an acceptable storage cost given curriculum content's low volume compared to, say, AI interaction logs, consistent with how [ADR-0010](0010-backup-retention-and-dr-targets.md) already treats storage cost as generally cheap at this scale.
- The curriculum taxonomy and reference-curriculum-tracking question remains open — this ADR doesn't gate on it, but it's still real, separate work.

## Review date

Revisit only if curriculum content volume or edit frequency ever makes retaining every superseded version a real storage or performance concern — unlikely at Lumora's current scale, and not a reason to delay this decision.
