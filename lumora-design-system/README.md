# Lumora Design System

Scoped per [ADR-0013](../lumora-docs/docs/21-adr/0013-tailwind-v4-design-tokens.md)'s
own review trigger ("revisit when Phase 3 mobile work starts") — mobile shipped
this session, and it exposed real drift: `lumora-mobile` had hand-transcribed
Tailwind's zinc/red/amber hex values into React Native `StyleSheet`s across five
files, each a separate guess at the same colors.

## What's here

`tokens.json` — the color palette both apps already use, as plain data. It's
Tailwind CSS v4's own default zinc/red/amber shades, not a new brand palette;
nobody has decided one yet, and inventing one here would be guessing at a
product/design decision this project has no grounding to make.

- **lumora-academy** (Next.js) needs no changes to consume it — Tailwind v4
  ships this exact palette built in, so `zinc-500`, `red-600`, etc. already
  work with zero redeclaration (this is ADR-0013's point: the framework's
  default *is* the source of truth here).
- **lumora-mobile** (React Native, no Tailwind) mirrors these values in
  `lumora-mobile/src/constants/colors.ts`, imported everywhere a portal
  screen previously hardcoded a hex literal.

## What's deliberately not here

**No shared component library.** A web `<Link>` and a React Native `<Link>`
share no runtime — building one would mean adopting a cross-platform styling
framework (NativeWind, Tamagui, or similar), a real architecture decision
nobody has made. `tokens.json` is data, consumable by both stacks' own native
styling systems; that's the smallest thing that actually closes the drift gap
found this session.

**No codegen/pipeline tool** (Style Dictionary or similar) turning
`tokens.json` into `colors.ts` automatically. ADR-0013 already rejected a
token pipeline for the web+Filament case because both sides only needed plain
CSS variables — the same reasoning doesn't fully carry over now that
`lumora-mobile` needs a non-CSS format, but a two-file, rarely-changing color
palette doesn't justify a build tool either. `colors.ts` is kept in sync with
`tokens.json` by hand; if this drifts again, that's the signal to revisit and
add real pipeline tooling, not to have pre-built one speculatively.
