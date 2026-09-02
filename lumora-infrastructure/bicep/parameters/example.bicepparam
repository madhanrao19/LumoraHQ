// Copy to a gitignored *.bicepparam (or supply via --parameters at deploy
// time) and fill in real values. Never commit real passwords — these should
// come from a secure pipeline variable, not a checked-in file.
using '../main.bicep'

param location = 'eastus'
param namePrefix = 'lumora'
param postgresAdminPasswordStaging = ''
param postgresAdminPasswordProduction = ''
