# ADR 0007: Use Azure Key Vault as the Secret Manager

## Status

Proposed

## Context

[Security & Privacy](../12-security-privacy/index.md#secrets-management) already established the principle: secrets (AI provider API keys, database credentials, storage keys) are environment configuration, never committed. It deferred the actual mechanism to [Infrastructure & DevOps](../13-infrastructure-devops/index.md#secrets), which flagged "which secret manager holds them in each environment" as open — while already noting Azure Key Vault as "the natural fit given the hosting decision, but not yet an ADR." Azure is already the decided hosting platform ([Technology Stack](../07-software-architecture/technology-stack.md)).

## Decision

Use **Azure Key Vault** as the secret manager for all environments. Secrets are injected as environment variables at deploy time — never baked into container images, never committed to a repository, never hardcoded in a `.env` file that reaches version control.

## Alternatives considered

- **HashiCorp Vault** (self-hosted or Vault Cloud). More powerful and cloud-portable, but adds an entirely separate service to operate, secure, and pay for, when the hosting decision already puts everything on Azure with no multi-cloud requirement in scope. Running a portable, multi-cloud-capable secrets service today would be the same kind of premature complexity the project has already avoided elsewhere (modular monolith over microservices, [ADR-0001](0001-use-laravel-filament-postgresql.md)).
- **Plain `.env` files per environment, manually managed.** Zero new tooling, but doesn't scale past a solo/tiny team, is easy to leak by accident, and gives no audit trail or rotation — directly working against [Security & Privacy](../12-security-privacy/index.md#audit-accountability)'s audit-and-accountability principle applied to who touched a secret and when.
- **Azure Key Vault (chosen).** First-party for the already-decided hosting platform — no new vendor to evaluate, adopt, or budget for. Gives audit logging and rotation without custom tooling, and integrates natively with whichever Azure compute model [Infrastructure & DevOps](../13-infrastructure-devops/index.md#hosting-cdn-decided) eventually settles on.

## Consequences

Positive:
- No new vendor evaluation — Azure is already the decided platform.
- Native audit trail (who accessed which secret, when) for free, supporting the audit-and-accountability principle already established for the platform generally.
- Rotation supported without building custom tooling.

Trade-offs:
- Ties secret management more tightly to Azure — a vendor-lock consideration under the [Constitution](../00-constitution/index.md#non-negotiable-principles) principle 10. This isn't a *new* trade-off, though: the hosting decision already accepted Azure dependency for compute, and a portable secrets layer wouldn't meaningfully reduce that lock-in while everything else stays Azure-hosted.
- Key Vault access isn't practical for every local development loop. A lightweight local-dev approach (e.g. a gitignored local `.env` for solo/local work, populated by hand or a small sync script) is still needed — that specific mechanic is a follow-up, not decided by this ADR.

## Review date

Revisit once the Azure compute model ([Infrastructure & DevOps](../13-infrastructure-devops/index.md#hosting-cdn-decided)) is decided, to confirm Key Vault integrates cleanly with whichever option is chosen. Revisit sooner only if a second cloud provider is ever introduced.
