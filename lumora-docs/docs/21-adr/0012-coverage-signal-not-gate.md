# ADR 0012: Coverage Is a Signal, Not a Blocking Gate

## Status

Accepted

## Context

[Testing & QA](../14-testing-qa/index.md#release-readiness) flagged coverage targets/thresholds as open, tied to whether CI blocks merges — that half is now resolved ([ADR-0003](0003-github-actions-required-status-checks.md): yes, CI blocks). The remaining question is what a blocking check should actually require beyond "the test suite passes": is there also a coverage-percentage floor, and if so, what?

## Decision

1. **No blanket line/statement coverage percentage is enforced as a merge-blocking gate.** A percentage target incentivizes testing whatever is easiest to cover — getters, simple mappers — rather than what's actually risky. That's the well-established failure mode of coverage-as-a-target (Goodhart's law applied to testing): the number goes up while the risky code stays thin.
2. **Two concrete, non-numeric requirements are enforced instead**, through code review and the "tests ship with the PR" rule already in [Development Standards](../08-development-standards/index.md#testing-expectations):
   - Every module's public service boundary ([Software Architecture](../07-software-architecture/index.md#primary-modules-working-draft), [Development Standards](../08-development-standards/index.md#enforcing-module-boundaries-in-code)) has tests exercising its documented behavior.
   - Every AI Gateway behavior [Testing & QA](../14-testing-qa/index.md#the-ai-testing-boundary) already names as in-scope for automated testing — audit logging, blocking/escalating unsafe output, returning drafts rather than publishing, rate limiting — has a passing test, with no exception. These are safety-relevant and non-negotiable regardless of what any percentage target would have required.
3. **Coverage percentage is still measured and reported in CI** — Pest/PHPUnit and Jest ([ADR-0011](0011-jest-frontend-unit-testing.md)) both report it natively at no extra cost. A sharp, unexplained drop is a prompt for a reviewer to ask why, not an automatic build failure.

## Alternatives considered

- **A fixed blanket percentage target (e.g. 80%) as a hard CI gate.** Common default, easy to state — but the standard critique applies directly: teams satisfy the number by testing simple code while leaving complex, risky logic (the AI Gateway's safety branching, say) under-tested. That's exactly the wrong bias for a child-safety-first platform, where the risky code is precisely what needs the most confidence.
- **No coverage measurement at all.** Cheapest, but throws away a signal that costs nothing to collect — reviewers lose an easy "did this PR quietly drop coverage" flag with no offsetting benefit.
- **Behavior-focused requirements plus trend-only coverage reporting (chosen).** Concentrates effort on what's actually safety-critical instead of an arbitrary number, while keeping the free signal for reviewers.

## Consequences

Positive:
- Testing effort concentrates on module boundaries and AI Gateway safety behavior — the places that actually matter — instead of being gamed toward easy code.
- Directly matches the AI testing boundary already established in [Testing & QA](../14-testing-qa/index.md#the-ai-testing-boundary).
- No new CI machinery required beyond what Pest/PHPUnit/Jest already report.

Trade-offs:
- "Every module's public service boundary has tests" is a code-review judgment call, not a machine-enforced number — it relies on reviewer discipline. This is consistent with how [Development Standards](../08-development-standards/index.md#enforcing-module-boundaries-in-code) already enforces module boundaries generally (code review, not tooling), not a new kind of trust being introduced here.
- A team that later wants a hard blocking percentage on top of this can add one without contradicting this decision — this ADR sets a floor of specific requirements, not a ceiling on future rigor.

## Review date

Revisit if code review alone proves insufficient to catch undertested module boundaries once a second contributor joins (the same team-size trigger [ADR-0004](0004-github-flow-branching-and-commit-conventions.md) already uses), or if a real regression ships that a coverage-percentage gate would plausibly have caught.
