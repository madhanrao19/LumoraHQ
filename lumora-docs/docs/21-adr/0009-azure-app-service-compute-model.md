# ADR 0009: Use Azure App Service (Linux) as the Compute Model

## Status

Accepted

## Context

[Infrastructure & DevOps](../13-infrastructure-devops/index.md#hosting-cdn-decided) already decided Azure as the hosting platform but left the compute model open — App Service, Container Apps, or AKS. [ADR-0001](0001-use-laravel-filament-postgresql.md) already committed to a modular monolith, explicitly rejecting microservices "until scale, team boundaries, performance, or reliability justify it" — that reasoning bears directly on this choice.

Verified before writing this (2026-09-01): Azure App Service on Linux has official first-party Laravel support — Microsoft publishes a dedicated tutorial and [sample repository](https://github.com/Azure-Samples/laravel-tasks) for deploying Laravel to App Service, including the standard `public/` site-root configuration. PHP on **Windows** App Service reached end of support in November 2022 — Linux is not a style preference here, it's the only supported option. App Service's managed PHP runtime now goes up to PHP 8.5 (available since April 2026), which comfortably covers Laravel 13's PHP 8.3+ requirement ([Technology Stack](../07-software-architecture/technology-stack.md)).

## Decision

Use **Azure App Service on Linux** as the compute host for the Laravel backend — one deployment for the whole modular monolith, not split per module. Use App Service's deployment slots to implement the staging/production split from [ADR-0008](0008-three-environment-topology.md).

## Alternatives considered

- **AKS (full Kubernetes).** The most flexible and scalable option, and the natural fit *if* Lumora ever splits into separately-deployed services — but that future isn't now. Running a full Kubernetes cluster to host one Laravel monolith is exactly the operational overhead [ADR-0001](0001-use-laravel-filament-postgresql.md) already rejected by choosing a modular monolith over microservices at launch. Revisit only when that ADR's own stated trigger (scale, team boundaries, performance, or reliability) is actually met.
- **Azure Container Apps.** A middle ground — container-based with some auto-scaling, less overhead than AKS — but still requires building and maintaining a container image and its build pipeline for what is, today, one deployable PHP application. App Service's Linux runtime builds Laravel natively via Composer (through Azure's Oryx build system) with no Dockerfile required. Container Apps becomes worth it if/when a specific module (the AI Gateway, say, under heavy Tutor traffic) needs to scale independently from the rest of the monolith — not a need that exists yet.
- **Azure App Service, Linux (chosen).** Zero container tooling needed to get started, native Composer-based build, official first-party Laravel support, PHP 8.5 already available and comfortably ahead of Laravel 13's 8.3+ floor, and deployment slots map directly onto ADR-0008's staging/production model without introducing a separate mechanism for it.

## Consequences

Positive:
- Fastest path to a working deployment — no Dockerfile or container registry to build and maintain for a single monolith.
- Native fit for exactly what exists today: one Laravel application.
- Deployment slots give ADR-0008's staging/production split a built-in mechanism instead of a bespoke one.
- Matches the "small team, fast to build" reasoning [ADR-0001](0001-use-laravel-filament-postgresql.md) already used for the framework choice.

Trade-offs:
- Less workload isolation than Container Apps or AKS — if a specific module ever needs independent scaling from the rest of the monolith, App Service can't do that without either scaling the whole app or migrating. This is an accepted, explicit future migration cost, not a blocker today — the same "split only when justified" principle ADR-0001 already accepted.
- This decision is Linux-specific; Windows App Service isn't a fallback (PHP support there ended November 2022).

## Review date

Revisit when the modular monolith is actually split into separately-deployed services — the same trigger [ADR-0001](0001-use-laravel-filament-postgresql.md) already named (scale, team boundaries, performance, or reliability). Not before.
