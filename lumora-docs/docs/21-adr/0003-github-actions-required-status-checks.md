# ADR 0003: Use GitHub Actions with Required Status Checks for Lumora Repos

## Status

Proposed

## Context

[Infrastructure & DevOps](../13-infrastructure-devops/index.md#cicd) already flagged CI/CD pipeline choice and merge-blocking policy as open, and noted an existing precedent: `.github/workflows/docs.yml` already builds and strict-checks `lumora-docs` on every push/PR to `main`.

Two other things already decided depend on tests actually running and passing, not just existing:

- [Development Standards](../08-development-standards/index.md#testing-expectations) requires tests ship with the same PR that adds code.
- [Testing & QA](../14-testing-qa/index.md#release-readiness) lists passing Pest/PHPUnit and Playwright suites as a release-readiness requirement.

Without an enforced gate, "tests pass" is only a convention — nothing stops a PR from merging with a failing suite unless something actually blocks it. Note honestly: this repository's history so far is direct commits to `main` with no PRs used yet, so this ADR's blocking policy applies once the application repos (`lumora-api`, `lumora-academy`, etc.) have their first CI workflow and real contributors opening PRs — not retroactively.

## Decision

Continue using GitHub Actions (the existing precedent) for `lumora-api`/`lumora-academy`/other application repos' CI, and require it as a **blocking** status check on pull requests targeting `main` — a failing check prevents merge, once each repo has its first CI workflow.

## Alternatives considered

- **No CI initially.** Simplest to start, but gives no protection against regressions landing on `main`, and contradicts the verify-before-complete discipline already established in [Development Standards](../08-development-standards/index.md) and the `/verify` command in [Claude Code Operating System](../15-claude-code-operating-system/index.md#custom-slash-commands).
- **Advisory-only CI** (runs and reports, doesn't block). Flexible for urgent fixes, but allows `main` to go red whenever someone merges despite a failing check — the gate becomes optional exactly when it matters most.
- **Blocking CI via GitHub Actions required status checks (chosen).** Matches what Testing & QA already assumes a release-ready feature looks like, and reuses tooling already proven to work in this monorepo rather than evaluating a new CI provider.

## Consequences

Positive:
- The `main` branch quality gate matches what Development Standards and Testing & QA already assume exists.
- Reuses existing, working tooling — no new CI provider to adopt or learn.

Trade-offs:
- Contributors can't merge around a flaky or slow test suite, so tests need to stay reliable and reasonably fast or the gate becomes a bottleneck instead of a safeguard.
- This ADR decides the *policy*; it doesn't itself flip GitHub's branch-protection "required status checks" setting on any repo. That's a manual follow-up per repo once its first CI workflow exists — this session doesn't have GitHub CLI access to verify or configure it, so treat it as unconfirmed until someone checks the repo settings directly.

## Review date

Revisit once `lumora-api` has its first CI workflow — confirm the check is actually configured as required, not just present, and revisit sooner if it becomes a bottleneck for contributors.
