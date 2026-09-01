# ADR 0013: Use Tailwind CSS v4 with CSS-First `@theme` Tokens

## Status

Proposed

## Context

[UI/UX Design System](../11-ui-ux-design-system/index.md#not-yet-decided) flagged two related open items: design token format/tooling, and the component library's styling approach — noting the root README commits to Next.js + React but not a styling method. It also already identified the real constraint this decision has to solve: tokens need to feed both the Next.js portal and the Filament admin theme, even though Filament (server-rendered PHP) can't consume React components ([UI/UX Design System](../11-ui-ux-design-system/index.md#two-client-stacks-one-design-system-with-a-real-constraint)).

Verified before writing this (2026-09-01): Tailwind CSS v4 (latest v4.3.3) replaced its JavaScript config file with a **CSS-first configuration** — design tokens are defined via an `@theme` directive directly in a CSS file, with no JS config required, runtime theme switching supported through plain CSS custom-property overrides, and a Rust-powered build engine that's dramatically faster than v3's JS-based one.

## Decision

1. Use **Tailwind CSS v4** for the Next.js portal's styling and component implementation.
2. Define all design tokens (colors, typography, spacing, radii) in Tailwind v4's `@theme` directive — **one CSS file is the source of truth**.
3. Because Tailwind v4 tokens are just CSS custom properties under the hood, that same file (or a generated subset) is consumed directly by the Filament admin theme's CSS — **no separate token-pipeline tool is needed** to translate between formats, since both sides only ever need plain CSS variables.

## Alternatives considered

- **A dedicated token pipeline (e.g. Style Dictionary) generating platform-specific outputs.** The traditional answer to "one token source, multiple consuming platforms" — but it's solving a translation problem that no longer exists once the source format (Tailwind v4's CSS variables) is already what both consumers need. Adds a real build step and tool to learn and maintain for no benefit today. Revisit if a genuinely non-CSS consumer needs tokens in a different format — a native mobile app (Roadmap Phase 3) is the natural trigger for that.
- **Tailwind v3 (JS-config-based).** The previous approach — still requires a JS config file, which is exactly the extra translation layer this decision avoids by using v4. No reason to pin an older major when v4 is current and strictly better for this specific cross-stack problem.
- **CSS-in-JS (styled-components, Emotion, etc.).** Full runtime styling dynamism, but a heavier pattern that doesn't play cleanly with React Server Components — Next.js's App Router uses Server Components by default, and many CSS-in-JS libraries rely on client-side runtime style injection that fights that model. Tailwind's utility classes need no runtime injection, so there's no friction here.
- **Tailwind v4 with CSS-first tokens (chosen).** Solves the two-stack token-sharing problem with what the library already provides, no extra pipeline tool, and works cleanly with Server Components.

## Consequences

Positive:
- A single CSS file is the literal, actual source of truth for tokens across both Next.js and Filament — no format-translation tooling to build or maintain.
- Tailwind v4's Rust-powered build is fast, and its CSS-first tokens work natively with React Server Components.

Trade-offs:
- Filament's theme still needs some integration glue — importing or copying the shared tokens CSS into Filament's own asset pipeline. That's a small, real task, not something automatic just because the format matches.
- Commits the portal to Tailwind's utility-class authoring style for every component — a real opinionated choice, though consistent with the "framework default over custom tooling" reasoning already used in [ADR-0005](0005-laravel-default-api-conventions.md) and [ADR-0011](0011-jest-frontend-unit-testing.md).

## Review date

Revisit when Phase 3 mobile work starts — a native mobile client is exactly the kind of non-CSS token consumer that would justify introducing a real pipeline tool (Style Dictionary or similar) on top of this decision.
