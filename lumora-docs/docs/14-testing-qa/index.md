# Testing & QA

## Purpose

This book defines how Lumora Academy code gets tested and what "release-ready" means. [Development Standards](../08-development-standards/index.md) already states the expectation (tests ship with the feature, using decided tooling); this book owns strategy, coverage, and the release gate.

## Status

Version: 1.2 foundation draft. Establishes test types, tooling, and the AI-testing boundary. Coverage targets are still flagged open below.

## Test types and tooling

Backend tooling is already decided ([Technology Stack](../07-software-architecture/technology-stack.md)):

| Layer | Tool | Covers |
|---|---|---|
| Laravel backend (unit/feature) | Pest / PHPUnit | Module logic, API endpoints, database interactions |
| Next.js portal (unit/component) | Jest + React Testing Library | Isolated component/hook logic — proposed, [ADR-0011](../21-adr/0011-jest-frontend-unit-testing.md) |
| End-to-end | Playwright | Real user flows across the Next.js portal and API together, plus anything touching `async` Server Components |

## What gets tested where

Following the module boundaries in [Software Architecture](../07-software-architecture/index.md#primary-modules-working-draft) and the "tests ship with the PR" rule in [Development Standards](../08-development-standards/index.md#testing-expectations):

- Each module (Identity & Access, Curriculum & Content, Lesson & Assessment Engine, AI Gateway, Notifications) owns Pest/PHPUnit coverage for its own logic — the same team that builds a module's code writes its tests, not a separate QA-only pass.
- Cross-module flows that only show up when a real user clicks through the portal (e.g. registering, taking an assessment, viewing AI-drafted content) are covered by Playwright, not by trying to simulate them through unit tests.
- Every feature spec's "Testing plan" section ([feature spec template](../24-templates/feature-spec-template.md)) is where the specific tests for that feature are decided before the feature is considered done — this book defines the tooling and strategy those plans should follow, not a replacement for writing one.

## The AI testing boundary

This is worth stating explicitly so it isn't assumed to work by accident: automated tests verify the AI Gateway's **behavior**, not the **correctness of AI-generated content**.

- In scope for automated testing: the AI Gateway logs every request/response, blocks/escalates unsafe output, returns AI content as a draft rather than published, and enforces rate limits — all testable, deterministic behaviors ([API Architecture](../10-api-architecture/index.md#the-ai-gateway-boundary)).
- Out of scope for automated testing: whether an AI-generated lesson is factually correct or pedagogically sound. That's a human review responsibility by design ([AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md), requirement 2) — no test suite substitutes for it, and treating "tests passed" as "content is safe to publish" would be a false signal.

## Accessibility

The [Constitution](../00-constitution/index.md#non-negotiable-principles) (principle 7: accessibility is default) makes this a release-readiness concern, not an optional pass. Detailed accessibility standards belong to [UI/UX Design System](../11-ui-ux-design-system/index.md) (not yet written); this book's role is to hold QA accountable for checking against whatever that book defines once it exists. Which automated accessibility tooling (if any) integrates into the Playwright suite is not yet decided.

## Release readiness

Before a feature or release ships, per the [Development Standards](../08-development-standards/index.md#feature-workflow) feature workflow:

- The feature spec's testing plan is satisfied, not just written.
- Pest/PHPUnit and Playwright suites pass.
- No unresolved findings from a [Security & Privacy](../12-security-privacy/index.md) review are outstanding for the feature.
- Documentation impact from the feature spec has actually been made — a feature isn't release-ready with its own docs still pending.

Coverage is deliberately not a blocking percentage gate — [ADR-0012](../21-adr/0012-coverage-signal-not-gate.md) requires tests for module boundaries and every AI Gateway safety behavior instead, with coverage percentage kept as a reported trend signal only. Whether CI blocks merges on failing tests at all is resolved separately — [ADR-0003](../21-adr/0003-github-actions-required-status-checks.md) proposes blocking, owned by [Infrastructure & DevOps](../13-infrastructure-devops/index.md).

## Scope boundaries

| Topic | Owned by |
|---|---|
| Feature workflow this testing plugs into | [Development Standards](../08-development-standards/index.md) |
| Modules and API surface being tested | [Software Architecture](../07-software-architecture/index.md), [API Architecture](../10-api-architecture/index.md) |
| AI content correctness (human review, not testing) | [AI Development Bible](../06-ai-development-bible/index.md) |
| Accessibility standards detail | [UI/UX Design System](../11-ui-ux-design-system/index.md) |
| CI/CD pipeline mechanics and enforcement | [Infrastructure & DevOps](../13-infrastructure-devops/index.md) |

## Related documents

- [Feature Spec Template](../24-templates/feature-spec-template.md) — where per-feature testing plans are written.
- [Development Standards](../08-development-standards/index.md) — the workflow this book's release gate closes.
- [AI Safety Principles](../06-ai-development-bible/ai-safety-principles.md) — why AI content correctness isn't an automated-testing concern.
