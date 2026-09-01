# ADR 0011: Use Jest with React Testing Library for Frontend Unit Testing

## Status

Accepted

## Context

[Testing & QA](../14-testing-qa/index.md#test-types-and-tooling) already decided Playwright for end-to-end coverage but left the frontend unit-test tool open, flagging it explicitly since [Technology Stack](../07-software-architecture/technology-stack.md) only commits to Playwright.

Verified before writing this (2026-09-01), against Next.js's own official documentation at v16.3.4 (matching [Technology Stack](../07-software-architecture/technology-stack.md)'s pinned version): Next.js publishes official setup guides for **both** Jest and Vitest, each paired with React Testing Library. Both tools share the identical limitation — neither supports `async` Server Components, and Next.js recommends E2E testing (already Playwright, per [Testing & QA](../14-testing-qa/index.md#the-ai-testing-boundary)'s adjacent reasoning) for those regardless of which unit tool is picked. That limitation is real, but it's not a differentiator between the two options — it constrains both equally.

The actual difference: Jest has had **built-in first-party integration** via `next/jest` since Next.js 12 — it auto-configures the SWC transform, mocks CSS/image/font imports, and loads `.env` files with zero extra bundler involved. Vitest requires manually wiring `@vitejs/plugin-react` and `vite-tsconfig-paths`, which means introducing Vite as a second build tool purely for tests — Next.js uses its own bundler (Turbopack/webpack), not Vite, so there's no existing Vite dependency in this stack for Vitest to piggyback on.

## Decision

Use **Jest with React Testing Library**, configured via `next/jest`, for frontend unit and component testing in `lumora-academy` and `lumora-design-system`. Playwright (already decided) remains the tool for anything touching `async` Server Components or full user flows.

## Alternatives considered

- **Vitest + React Testing Library.** Also officially documented by Next.js, and generally faster given its Vite-native architecture — but that speed advantage doesn't compound with anything else in this stack, since nothing else here uses Vite. Adopting it means carrying a second bundler dependency solely for tests, where Jest's `next/jest` reuses Next.js's own SWC transform with nothing extra in the mix. Worth revisiting if Jest's speed becomes a real bottleneck in practice.
- **No frontend unit tests, Playwright only.** Simplest on paper, but pushes every check — including isolated component/hook logic that doesn't need a browser — through slower, browser-driven E2E runs, working against [Development Standards](../08-development-standards/index.md#testing-expectations)' "tests ship with the same PR" expectation.
- **Jest + React Testing Library via `next/jest` (chosen).** Zero extra bundler dependency, first-party Next.js integration maintained by the framework itself, officially documented setup path.

## Consequences

Positive:
- Reuses Next.js's own build pipeline (SWC) for test transforms instead of introducing Vite.
- First-party, framework-maintained integration (`next/jest`) rather than a community-wired one.
- Uses React Testing Library either way, so switching tools later wouldn't require rewriting test *patterns*, just the runner.

Trade-offs:
- Jest is generally slower to start and run than Vitest for large suites — an accepted cost now for a simpler dependency graph. If suite size or CI time becomes a real pain point, Vitest is a legitimate, well-documented swap later.

## Review date

Revisit if Jest's performance becomes a measurable CI bottleneck once the test suite is large enough to notice, or if the project ever adopts Vite for something else — either would remove the "no existing Vite dependency" reasoning this decision rests on.
