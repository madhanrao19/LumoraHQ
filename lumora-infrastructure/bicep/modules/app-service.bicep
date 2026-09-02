// Azure App Service (Linux) for the Laravel modular monolith — ADR-0009.
// One Web App shared by staging and production via a deployment slot
// (ADR-0009 point: "use App Service's deployment slots to implement the
// staging/production split from ADR-0008") — this is deliberately a single
// resource, not one per environment.

param location string
param namePrefix string
param appServicePlanSku string = 'B1'

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: '${namePrefix}-plan'
  location: location
  kind: 'linux'
  sku: {
    name: appServicePlanSku
  }
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2023-12-01' = {
  name: '${namePrefix}-app'
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: plan.id
    siteConfig: {
      linuxFxVersion: 'PHP|8.5'
      alwaysOn: true
    }
  }
}

// Production traffic hits webApp directly (the default/production slot).
// Staging deploys here first, then gets swapped into production —
// ADR-0008's "automatic deploy to staging, manual promotion to production."
resource stagingSlot 'Microsoft.Web/sites/slots@2023-12-01' = {
  parent: webApp
  name: 'staging'
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: plan.id
    siteConfig: {
      linuxFxVersion: 'PHP|8.5'
      alwaysOn: true
    }
  }
}

output webAppName string = webApp.name
output webAppHostName string = webApp.properties.defaultHostName
output stagingSlotHostName string = stagingSlot.properties.defaultHostName
output productionPrincipalId string = webApp.identity.principalId
output stagingPrincipalId string = stagingSlot.identity.principalId
