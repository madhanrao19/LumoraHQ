# Development Standards

## Purpose

This book defines how Lumora Academy code gets built: how a feature moves from idea to shipped, how the module boundaries defined in [Software Architecture](../07-software-architecture/index.md) are enforced in practice, and which conventions are already decided versus still open.

## Status

Version: 1.1 foundation draft. Establishes the feature workflow and boundary-enforcement principles ahead of Phase 1 coding. Branching, PR, and style specifics are flagged open below rather than invented.

## Feature workflow

Per the [Constitution](../00-constitution/index.md#non-negotiable-principles) (principle 8: documentation is part of the product; undocumented features are incomplete):

1. **Non-trivial features start as a spec**, using [the feature spec template](../24-templates/feature-spec-template.md) — it already forces the right questions: education considerations, AI considerations, security/privacy considerations, acceptance criteria, testing plan, and documentation impact. A feature isn't ready to build until these are answered, not just the happy-path requirements.
2. **Binding architecture decisions become an ADR**, using [the ADR template](../24-templates/adr-template.md) — see [Architecture Decision Records](../21-adr/index.md). This is how the "not yet decided" items flagged in [Software Architecture](../07-software-architecture/index.md), [Database Architecture](../09-database-architecture/index.md), and [API Architecture](../10-api-architecture/index.md) get resolved: propose an ADR, don't just pick an answer in code.
3. **Documentation updates ship with the feature**, not after — a feature that changes behavior without an updated doc is incomplete per the Constitution, not merely "needs a follow-up."

## Enforcing module boundaries in code

[Software Architecture](../07-software-architecture/index.md#primary-modules-working-draft) and [Database Architecture](../09-database-architecture/index.md#schema-ownership) both state the rule — a module owns its own tables and its own code, other modules reference it by ID instead of reaching in. This book owns *how that's actually enforced*:

- A module's internal classes (models, services) are not imported directly from another module's code. Cross-module access goes through that module's own public service interface — the same shape an external API caller would use, even though it's an in-process call.
- Code review is the enforcement point until/unless static tooling (e.g. dependency-boundary linting) is adopted. A PR that reaches across a module boundary directly should be flagged in review, the same as a PR that skips tests.
- New modules or a change to the module map itself goes through an ADR, not an ad hoc folder addition — the module list is a documented decision, not just a directory listing.

## Testing expectations

Tooling is already decided ([Technology Stack](../07-software-architecture/technology-stack.md)): **Pest/PHPUnit** for the Laravel backend, **Playwright** for end-to-end coverage. This book states the expectation; test *strategy and coverage targets* are owned by [Testing & QA](../14-testing-qa/index.md).

- Every feature spec's "Testing plan" section is filled in before the feature is considered done, not left as a placeholder.
- Backend module code gets Pest/PHPUnit coverage as part of the same PR that adds it, not a follow-up ticket.

## Code style

Default to each stack's standard tool rather than inventing custom rules: Laravel Pint for PHP, ESLint/Prettier for the Next.js portal. Deviating from a framework default is itself a decision worth a one-line rationale in the PR, not a silent style drift.

!!! note "Not yet decided"
    Branching model (trunk-based vs. feature branches vs. Git Flow), PR size/review requirements, and commit message conventions are all open — pick and document these before Phase 1 coding starts across `lumora-api`/`lumora-academy`, since retrofitting a convention after multiple contributors are active is disruptive. Resolve as an ADR; this book will link to it once decided.

## Scope boundaries

| Topic | Owned by |
|---|---|
| Module boundaries these conventions enforce | [Software Architecture](../07-software-architecture/index.md) |
| Schema/migration ownership these conventions protect | [Database Architecture](../09-database-architecture/index.md) |
| API contract conventions | [API Architecture](../10-api-architecture/index.md) |
| Test strategy and coverage targets | [Testing & QA](../14-testing-qa/index.md) |
| Security review checklist, secrets handling | [Security & Privacy](../12-security-privacy/index.md) |
| CI/CD pipeline mechanics | [Infrastructure & DevOps](../13-infrastructure-devops/index.md) |

## Related documents

- [Feature Spec Template](../24-templates/feature-spec-template.md) — required starting point for non-trivial features.
- [ADR Template](../24-templates/adr-template.md) / [ADR index](../21-adr/index.md) — required for binding decisions.
- [Software Architecture](../07-software-architecture/index.md) — the module map these standards protect.
- [Roadmap](../25-roadmap/index.md) — the phase these standards are built to support.
