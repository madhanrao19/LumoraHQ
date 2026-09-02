# Lumora Infrastructure

Azure Bicep for Lumora Academy's hosting: App Service (Linux), Key Vault,
PostgreSQL Flexible Server, and Redis Cache.

**Validated with `az bicep build`** (Azure CLI 2.90.0, Bicep CLI 0.46.1) —
`main.bicep` and its four modules compile to ARM JSON with zero errors or
warnings, and `parameters/example.bicepparam` compiles against it. That
confirms syntax and type-correctness, not that a real deployment succeeds —
`az deployment group validate`/`--what-if` would need real Azure credentials
this environment doesn't have. Review the plan before ever deploying it.

## What this models

| Resource | Decision |
|---|---|
| App Service (Linux), one Web App + a `staging` slot | ADR-0009 |
| Key Vault, one per environment | ADR-0007 |
| PostgreSQL Flexible Server, one per environment | Technology Stack, ADR-0010 (35-day PITR) |
| Redis Cache, one per environment | Technology Stack |

Production and staging share a single App Service via deployment slots —
promotion is a slot swap, matching ADR-0008's "automatic deploy to staging,
manual promotion to production." Everything else (Key Vault, database,
Redis) is a genuinely separate resource per environment, since production
data must never share a database with staging.

## What this deliberately does not model

- **S3-compatible object storage** — the provider isn't decided (Azure Blob
  vs. Cloudflare R2 vs. something else). Picking one here would be guessing
  at an undecided architecture question, not following a made decision.
- **Meilisearch hosting** — no managed Azure offering exists; self-hosted vs.
  a hosted Meilisearch Cloud plan isn't decided anywhere in `lumora-docs`.
- **Network topology** (VNET, private endpoints) — the Postgres firewall
  rule here is a broad placeholder, not a security posture. Infrastructure &
  DevOps hasn't decided network topology yet.
- **pgvector activation** — Azure Flexible Server needs the `vector`
  extension added to the server's allow-list after the server exists; this
  template provisions the server but doesn't flip that switch.
- **CI/CD wiring** to actually run this template on merge/promotion
  (ADR-0003 decides CI exists; this repo doesn't yet contain the pipeline
  that would invoke `az deployment group create` against it).

## Usage

```bash
az deployment group create \
  --resource-group <your-rg> \
  --template-file bicep/main.bicep \
  --parameters bicep/parameters/<your-local-copy>.bicepparam
```

`parameters/example.bicepparam` is a template — copy it, fill in real
values, and never commit the copy (see `.gitignore`).
