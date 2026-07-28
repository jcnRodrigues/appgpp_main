param(
  [switch]$Restart
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host "[Enable-IIS-Windows11] $Message" -ForegroundColor Yellow
}

function Enable-FeatureGroup {
  param(
    [string]$GroupName,
    [string[]]$Features
  )

  Write-Step "Habilitando $GroupName"
  foreach ($feature in $Features) {
    Write-Step "  -> $feature"
    Enable-WindowsOptionalFeature -Online -FeatureName $feature -All -NoRestart | Out-Null
  }
}

$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
  [Security.Principal.WindowsBuiltInRole]::Administrator
)
if (-not $isAdmin) {
  throw "Execute este script como Administrador."
}

$groups = @(
  @{
    Name = "IIS"
    Features = @(
      "IIS-WebServerRole",
      "IIS-WebServer",
      "IIS-CommonHttpFeatures",
      "IIS-HttpErrors",
      "IIS-HttpRedirect",
      "IIS-ApplicationDevelopment",
      "IIS-NetFxExtensibility45",
      "IIS-HealthAndDiagnostics",
      "IIS-RequestMonitor",
      "IIS-Security",
      "IIS-RequestFiltering",
      "IIS-Performance",
      "IIS-WebServerManagementTools",
      "IIS-ManagementConsole"
    )
  }
)

foreach ($group in $groups) {
  Enable-FeatureGroup -GroupName $group.Name -Features $group.Features
}

Write-Step "IIS habilitado. Agora instale URL Rewrite e Application Request Routing manualmente."
Write-Step "Se necessario, reinicie o Windows para finalizar a ativacao completa."

if ($Restart) {
  Write-Step "Reiniciando o computador..."
  Restart-Computer -Force
}
