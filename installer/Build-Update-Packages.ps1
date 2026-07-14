param(
  [string]$OutputDir = "dist"
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host "[Build-Update-Packages] $Message" -ForegroundColor Yellow
}

function Get-ProjectVersion {
  param([string]$ProjectRoot)

  $packagePath = Join-Path $ProjectRoot "package.json"
  if (-not (Test-Path -LiteralPath $packagePath)) {
    return "0.0.0"
  }

  try {
    $packageJson = Get-Content -LiteralPath $packagePath -Raw | ConvertFrom-Json
    $version = [string]$packageJson.version
    if (-not [string]::IsNullOrWhiteSpace($version)) {
      return $version.Trim()
    }
  } catch {
    # fallback below
  }

  return "0.0.0"
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$distDir = Join-Path $projectRoot $OutputDir
$packageVersion = Get-ProjectVersion -ProjectRoot $projectRoot
$buildTimestamp = Get-Date -Format "yyyy.MM.dd.HHmm"
$buildVersion = "$packageVersion-$buildTimestamp"
$iconSource = Join-Path $projectRoot "public\Imagens\AppGPP.ico"
$iconTarget = Join-Path $distDir "AppGPP.ico"
$coreUpdateScript = Join-Path $projectRoot "scripts\Update-AppGPP.ps1"

if (-not (Test-Path -LiteralPath $coreUpdateScript)) {
  throw "Script base nao encontrado: $coreUpdateScript"
}

New-Item -ItemType Directory -Path $distDir -Force | Out-Null
Copy-Item -LiteralPath $coreUpdateScript -Destination (Join-Path $distDir "Update-AppGPP.ps1") -Force
if (Test-Path -LiteralPath $iconSource) {
  Copy-Item -LiteralPath $iconSource -Destination $iconTarget -Force
}

. (Join-Path $PSScriptRoot "tools\ps2exe.ps1")

$targets = @(
  @{ input = (Join-Path $projectRoot "scripts\Update-AppGPP-Menu.ps1"); output = (Join-Path $distDir "AppGPP-Update-Menu-$buildVersion.exe") },
  @{ input = (Join-Path $projectRoot "scripts\Update-AppGPP-System.ps1"); output = (Join-Path $distDir "AppGPP-Update-System-$buildVersion.exe") },
  @{ input = (Join-Path $projectRoot "scripts\Update-AppGPP-Database.ps1"); output = (Join-Path $distDir "AppGPP-Update-Database-$buildVersion.exe") },
  @{ input = (Join-Path $projectRoot "scripts\Update-AppGPP-Both.ps1"); output = (Join-Path $distDir "AppGPP-Update-Both-$buildVersion.exe") }
)

foreach ($target in $targets) {
  Write-Step "Compilando $(Split-Path $target.input -Leaf)"
  $args = @{
    inputFile  = $target.input
    outputFile = $target.output
    version    = $buildTimestamp
  }
  if (Test-Path -LiteralPath $iconTarget) {
    $args.iconFile = $iconTarget
  }

  Invoke-ps2exe @args
  if (-not (Test-Path -LiteralPath $target.output)) {
    throw "Falha ao gerar o arquivo: $($target.output)"
  }
}

Copy-Item -LiteralPath (Join-Path $distDir ("AppGPP-Update-Menu-$buildVersion.exe")) -Destination (Join-Path $distDir "AppGPP-Update-Menu.exe") -Force
Copy-Item -LiteralPath (Join-Path $distDir ("AppGPP-Update-System-$buildVersion.exe")) -Destination (Join-Path $distDir "AppGPP-Update-System.exe") -Force
Copy-Item -LiteralPath (Join-Path $distDir ("AppGPP-Update-Database-$buildVersion.exe")) -Destination (Join-Path $distDir "AppGPP-Update-Database.exe") -Force
Copy-Item -LiteralPath (Join-Path $distDir ("AppGPP-Update-Both-$buildVersion.exe")) -Destination (Join-Path $distDir "AppGPP-Update-Both.exe") -Force

Write-Step "Pacotes gerados em: $distDir"
