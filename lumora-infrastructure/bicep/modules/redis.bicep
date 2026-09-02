// Azure Cache for Redis — one per environment. Cache/queue only, explicitly
// disposable per Database Architecture ("nothing is stored in Redis that
// isn't reconstructable from PostgreSQL") — no backup policy needed here.

param location string
param namePrefix string
param environment string
param skuName string = 'Basic'
param skuFamily string = 'C'
param skuCapacity int = 0

resource cache 'Microsoft.Cache/redis@2024-03-01' = {
  name: '${namePrefix}-redis-${environment}'
  location: location
  properties: {
    sku: {
      name: skuName
      family: skuFamily
      capacity: skuCapacity
    }
    enableNonSslPort: false
    minimumTlsVersion: '1.2'
  }
}

output hostName string = cache.properties.hostName
output sslPort int = cache.properties.sslPort
