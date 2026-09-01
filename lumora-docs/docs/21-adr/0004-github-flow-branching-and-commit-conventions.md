# ADR 0004: Use GitHub Flow with Squash Merges and Conventional Commits

## Status

Proposed

## Context

[Development Standards](../08-development-standards/index.md#code-style) flagged branching model, PR requirements, and commit conventions as open, warning that retrofitting a convention after multiple contributors are active is disruptive — so this should be resolved before Phase 1 coding starts in `lumora-api`/`lumora-academy`, not after.

[ADR-0003](0003-github-actions-required-status-checks.md) already proposes required status checks blocking merge to `main` — but a required check only means something if there's a PR gate to attach it to. This ADR is what makes that one meaningful in practice.

Current state, verified rather than assumed: this repository has a single committer (`madhanrao`) so far, with every commit made directly to `main` — no other branch has ever existed. Any convention adopted here needs to work today, solo, and still hold once more contributors join, without needing to be renegotiated then.

## Decision

1. **Branching model: GitHub Flow.** `main` stays deployable at all times. All work happens on short-lived branches created from `main`, merged back via pull request, then deleted.
2. **Every change to `main` in application repos goes through a PR** — even while solo — so [ADR-0003](0003-github-actions-required-status-checks.md)'s required status checks actually gate something, and so there's a reviewable record of each change. Required reviewer approval count is **not fixed by this ADR**: it's impractical to require approval while there's one contributor, so self-merge (after checks pass) is acceptable solo, and a minimum approval count should be added once a second contributor joins — that specific threshold is a follow-up decision, not this one.
3. **Merge strategy: squash merge.** One commit lands on `main` per PR, keeping history readable regardless of how messy the feature branch's intermediate commits were.
4. **Commit/PR title convention: Conventional Commits** (`type(scope): summary`, e.g. `feat(auth): add password reset flow`) for the squash-merge commit title. This gives [Release Notes](../26-release-notes/index.md#format-convention) a consistent, parseable structure to draw entries from later, rather than requiring someone to reconstruct "what shipped" from arbitrary commit messages.

## Alternatives considered

- **Git Flow** (`develop`/`release`/`hotfix` branches). More process ceremony than a small team building a modular monolith needs right now — the same "small team, fast to build" reasoning [ADR-0001](0001-use-laravel-filament-postgresql.md) already used. Worth revisiting only if release cadence or parallel-release complexity grows enough to justify it.
- **No enforced commit convention.** Simplest, but forgoes free-form changelog generation and gives no consistent structure for future tooling to key off.
- **Mandatory reviewer approval from day one.** Not practical given the repository is currently solo-maintained (verified via `git log`) — it would be a rule nobody could satisfy, which tends to just get ignored rather than followed.

## Consequences

Positive:
- Matches [ADR-0003](0003-github-actions-required-status-checks.md)'s PR-gated CI model — the required check has a gate to attach to.
- Low ceremony, fits the current team size without inventing process the team doesn't need yet.
- Conventional Commits gives [Release Notes](../26-release-notes/index.md) free structure to draw from once entries start getting written.

Trade-offs:
- Squash merge discards individual in-branch commit granularity from `main`'s history — an acceptable trade for a more readable log, but worth knowing before someone goes looking for a fine-grained blame trail.
- Conventional Commits only pays off if it's actually followed; nothing enforces the format yet (e.g. a commitlint check) — that's a follow-up if drift becomes a problem, not part of this decision.

## Review date

Revisit the reviewer-approval requirement once a second contributor joins an application repo. Revisit the branching model itself if release cadence or parallel-release complexity grows beyond what GitHub Flow comfortably handles.
