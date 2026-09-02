// Azure Database for PostgreSQL — Flexible Server, one per environment
// (production data must never share a server with staging). Backup/DR
// config follows ADR-0010 (35-day point-in-time recovery, zone-redundant
// storage); geo-redundant backup is explicitly deferred there until a
// deployment region and applicable privacy regulation are both settled.
//
// NOT modeled here: enabling the `vector` (pgvector) extension. Azure
// Flexible Server requires it added to the server's `azure.extensions`
// allow-list parameter, which this template doesn't set — do that as a
// follow-up once this server exists, per ADR-0001/pgvector's own note that
// it's "pgvector first; Qdrant later if justified."

@secure()
param administratorPassword string
param administratorLogin string = 'lumora_admin'
param location string
param namePrefix string
param environment string
param skuName string = 'Standard_B2s'
param storageSizeGB int = 32
param postgresVersion string = '18'

resource server 'Microsoft.DBforPostgreSQL/flexibleServers@2024-08-01' = {
  name: '${namePrefix}-psql-${environment}'
  location: location
  sku: {
    name: skuName
    tier: 'Burstable'
  }
  properties: {
    version: postgresVersion
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorPassword
    storage: {
      storageSizeGB: storageSizeGB
    }
    backup: {
      backupRetentionDays: 35
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
}

resource database 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2024-08-01' = {
  parent: server
  name: 'lumora'
  properties: {
    charset: 'UTF8'
  }
}

// Allow Azure services (the App Service) to reach this server. Tighten to a
// VNET rule instead of this broad allow-list once network topology is
// actually decided — not yet, per Infrastructure & DevOps.
resource allowAzureServices 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2024-08-01' = {
  parent: server
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

output serverName string = server.name
output fullyQualifiedDomainName string = server.properties.fullyQualifiedDomainName
