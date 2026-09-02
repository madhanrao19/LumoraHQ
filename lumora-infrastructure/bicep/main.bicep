// Lumora Academy — Azure infrastructure for staging + production.
//
// Scope, deliberately: App Service (ADR-0009), Key Vault (ADR-0007),
// PostgreSQL Flexible Server, and Redis Cache — the pieces an accepted ADR
// or Technology Stack entry actually pins to Azure. NOT modeled here:
//   - S3-compatible object storage: provider isn't decided (could be Azure
//     Blob, could be Cloudflare R2 alongside the already-decided Cloudflare
//     CDN) — picking one here would be guessing, not following a decision.
//   - Meilisearch hosting: no managed Azure offering exists; self-hosted vs.
//     Meilisearch Cloud isn't decided anywhere.
//   - Network topology (VNET/private endpoints): Infrastructure & DevOps
//     doesn't decide this yet: firewall rules here are intentionally broad
//     as a placeholder, not a security recommendation.
// This file has not been run through `az bicep build` — no Azure CLI in
// this environment to validate it against. Review before first deploy.

targetScope = 'resourceGroup'

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Short name used as a prefix for every resource name.')
param namePrefix string = 'lumora'

@secure()
@description('PostgreSQL administrator password, shared login name across environments, distinct per-environment servers.')
param postgresAdminPasswordStaging string

@secure()
param postgresAdminPasswordProduction string

// One App Service, shared between staging (slot) and production (default
// slot) — ADR-0009.
module appService 'modules/app-service.bicep' = {
  name: 'app-service'
  params: {
    location: location
    namePrefix: namePrefix
  }
}

// Everything below is genuinely per-environment — ADR-0008.
module keyVaultStaging 'modules/key-vault.bicep' = {
  name: 'key-vault-staging'
  params: {
    location: location
    namePrefix: namePrefix
    environment: 'staging'
    accessPrincipalId: appService.outputs.stagingPrincipalId
  }
}

module keyVaultProduction 'modules/key-vault.bicep' = {
  name: 'key-vault-production'
  params: {
    location: location
    namePrefix: namePrefix
    environment: 'production'
    accessPrincipalId: appService.outputs.productionPrincipalId
  }
}

module postgresStaging 'modules/postgres.bicep' = {
  name: 'postgres-staging'
  params: {
    location: location
    namePrefix: namePrefix
    environment: 'staging'
    administratorPassword: postgresAdminPasswordStaging
  }
}

module postgresProduction 'modules/postgres.bicep' = {
  name: 'postgres-production'
  params: {
    location: location
    namePrefix: namePrefix
    environment: 'production'
    administratorPassword: postgresAdminPasswordProduction
  }
}

module redisStaging 'modules/redis.bicep' = {
  name: 'redis-staging'
  params: {
    location: location
    namePrefix: namePrefix
    environment: 'staging'
  }
}

module redisProduction 'modules/redis.bicep' = {
  name: 'redis-production'
  params: {
    location: location
    namePrefix: namePrefix
    environment: 'production'
  }
}

output webAppHostName string = appService.outputs.webAppHostName
output stagingSlotHostName string = appService.outputs.stagingSlotHostName
output keyVaultStagingUri string = keyVaultStaging.outputs.vaultUri
output keyVaultProductionUri string = keyVaultProduction.outputs.vaultUri
output postgresStagingHost string = postgresStaging.outputs.fullyQualifiedDomainName
output postgresProductionHost string = postgresProduction.outputs.fullyQualifiedDomainName
output redisStagingHost string = redisStaging.outputs.hostName
output redisProductionHost string = redisProduction.outputs.hostName
