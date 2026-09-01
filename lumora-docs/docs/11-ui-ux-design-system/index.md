# UI/UX Design System

## Purpose

This book defines Lumora Academy's shared design tokens, component library, accessibility standard, and how UI consistency is kept across two different client stacks. [Software Architecture](../07-software-architecture/index.md) and [Testing & QA](../14-testing-qa/index.md) both defer accessibility detail here — this is where it actually lives.

## Status

Version: 1.3 foundation draft. Establishes the accessibility target and the client-consistency constraint below; token tooling, styling approach, and language strategy now all have proposed ADRs awaiting acceptance.

## Two client stacks, one design system — with a real constraint

Per [Software Architecture](../07-software-architecture/index.md#system-overview), the Student/Parent Portal is Next.js + React; the Admin Portal is Filament, which is server-rendered PHP, not React. This matters for what "shared design system" can actually mean:

- **`lumora-design-system`** (the shared component package — currently a placeholder) is directly consumable as React components by the Next.js portal only. Filament cannot import a React component library.
- **Design tokens** (colors, typography, spacing, radii) *can* be shared across both — as the single source of truth compiled into whatever format each stack needs. [ADR-0013](../21-adr/0013-tailwind-v4-design-tokens.md) (pending acceptance) proposes Tailwind CSS v4's CSS-first `@theme` tokens as that source: since they're plain CSS custom properties, Filament's theme consumes the same file directly, no separate token-pipeline tool required.
- Treat these as two different sharing problems: component-level reuse (Next.js only) and token-level consistency (both). Don't assume Filament will look identical to the portal — it should look *consistent* (same colors, type scale, spacing rhythm), not componentized from the same library.

## Accessibility

The [Constitution](../00-constitution/index.md#non-negotiable-principles) principle 7 makes accessibility a default, not an enhancement. **WCAG 2.2 AA** is the proposed target ([ADR-0006](../21-adr/0006-wcag-22-aa-accessibility-target.md), pending acceptance) — applied to every component in `lumora-design-system` and to the Filament admin theme alike (content editors and staff need it too, not just students). Concrete acceptance criteria (contrast ratios, keyboard navigation, screen-reader labeling) belong to each component's own spec once built, using this target as the bar.

Which automated accessibility tool (if any) enforces it in CI remains [Testing & QA](../14-testing-qa/index.md#accessibility)'s open question, not this book's.

## Language

Constitution principle 7 explicitly includes "different... languages," and content is built around Malaysian curriculum alignment. [ADR-0014](../21-adr/0014-english-only-launch-with-locale-route-scaffold.md) (pending acceptance) proposes English-only for Phase 1 — multi-language isn't a named Roadmap requirement yet — but structures routes under Next.js's native `[lang]` segment from day one, so the URL shape never needs a breaking retrofit if multi-language arrives later. No i18n library is adopted until that's a real, scheduled need.

## Devices and network conditions

Also from principle 7 ("different devices and internet conditions"): the design system should default to lightweight, resilient UI — avoid large client bundles and interactions that assume a fast connection or a high-end device, since that directly excludes the learners the platform is meant to serve. This is a design constraint on every component, not a separate performance workstream.

## Component ownership

`lumora-design-system` is the single source of shared UI components and tokens for the Next.js portal — other Lumora repos consume it rather than each re-implementing their own version of a button, form field, or card. This keeps styling changes to one place, consistent with the [Constitution](../00-constitution/index.md#non-negotiable-principles) principle 9 (modular architecture).

## Not yet decided

- UI language/locale strategy and i18n framework.

Each belongs in an ADR when decided, per [Development Standards](../08-development-standards/index.md#feature-workflow).

## Scope boundaries

| Topic | Owned by |
|---|---|
| Which client uses which stack | [Software Architecture](../07-software-architecture/index.md) |
| How accessibility gets tested/enforced | [Testing & QA](../14-testing-qa/index.md) |
| How token/library decisions get ratified | [Development Standards](../08-development-standards/index.md) |

## Related documents

- [Software Architecture](../07-software-architecture/index.md) — the client split this book designs for.
- [Testing & QA](../14-testing-qa/index.md) — where the accessibility target gets verified.
- [Constitution](../00-constitution/index.md) — principle 7, the source of the accessibility/language/device requirements above.
