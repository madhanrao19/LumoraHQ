// Azure Key Vault — ADR-0007. Each environment gets its own vault, not a
// shared one across environments ("Secrets are scoped per environment" —
// ADR-0008 point 3). Local dev doesn't get a vault; it uses a gitignored
// .env per ADR-0007's own noted follow-up.

param location string
param namePrefix string
param environment string
param accessPrincipalId string

resource vault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: '${namePrefix}-kv-${environment}'
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
  }
}

// Grants the App Service's (or slot's) managed identity permission to read
// secrets — role assignment, not an access policy, since RBAC auth is on.
resource secretsUserRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(vault.id, accessPrincipalId, 'Key Vault Secrets User')
  scope: vault
  properties: {
    principalId: accessPrincipalId
    principalType: 'ServicePrincipal'
    // Key Vault Secrets User built-in role.
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')
  }
}

output vaultName string = vault.name
output vaultUri string = vault.properties.vaultUri
