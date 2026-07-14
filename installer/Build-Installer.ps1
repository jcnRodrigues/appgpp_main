param(
  [string]$OutputExe = "dist\AppGPP-Installer.exe"
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host "[Build-Installer] $Message" -ForegroundColor Yellow
}

function Invoke-CheckedScript {
  param(
    [string]$ScriptPath,
    [string[]]$Arguments = @()
  )

  & powershell -ExecutionPolicy Bypass -File $ScriptPath @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Falha ao executar $ScriptPath com codigo $LASTEXITCODE"
  }
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$installerRoot = $PSScriptRoot
$distDir = Join-Path $projectRoot "dist"

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

$packageVersion = Get-ProjectVersion -ProjectRoot $projectRoot
$buildTimestamp = Get-Date -Format "yyyy.MM.dd.HHmm"
$installerVersion = $env:APPGPP_INSTALLER_VERSION
if ([string]::IsNullOrWhiteSpace($installerVersion)) {
  $installerVersion = "$packageVersion-$buildTimestamp"
}

if ([string]::IsNullOrWhiteSpace($OutputExe) -or $OutputExe -eq "dist\AppGPP-Installer.exe") {
  $OutputExe = "dist\AppGPP-Installer-$installerVersion.exe"
}

$outputPath = if ([System.IO.Path]::IsPathRooted($OutputExe)) { $OutputExe } else { Join-Path $projectRoot $OutputExe }
$outputPath = [System.IO.Path]::GetFullPath($outputPath)
$outputDir = Split-Path -Parent $outputPath
$payloadPath = Join-Path $distDir "AppGPP-Payload.zip"
$bundleZipPath = Join-Path $distDir "Instalador APPGPP.zip"
$iconSource = Join-Path $projectRoot "public\Imagens\AppGPP.ico"
$iconTarget = Join-Path $distDir "AppGPP.ico"

function Clear-PreviousInstallerArtifacts {
  param([string]$DistDir)

  $patterns = @(
    "AppGPP-Installer.exe",
    "AppGPP-Installer-*.exe",
    "AppGPP-Payload*.zip",
    "Instalador APPGPP*.zip",
    "~AppGPP-Installer-*.DDF"
  )

  foreach ($pattern in $patterns) {
    Get-ChildItem -LiteralPath $DistDir -Filter $pattern -File -ErrorAction SilentlyContinue |
      Remove-Item -Force -ErrorAction SilentlyContinue
  }
}

Write-Step "Validando build de producao (.next)"
if (-not (Test-Path (Join-Path $projectRoot ".next"))) {
  throw "Pasta .next nao encontrada. Execute 'npm run build' antes de gerar o instalador."
}

Write-Step "Preparando pasta dist"
New-Item -ItemType Directory -Path $distDir -Force | Out-Null
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
Clear-PreviousInstallerArtifacts -DistDir $distDir

Write-Step "Gerando payload"
Invoke-CheckedScript -ScriptPath (Join-Path $installerRoot "Build-Payload.ps1")

if (Test-Path -LiteralPath $iconSource) {
  Copy-Item -LiteralPath $iconSource -Destination $iconTarget -Force
}

Write-Step "Compilando instalador"
. (Join-Path $installerRoot "tools\ps2exe.ps1")

$ps2exeArgs = @{
  inputFile  = (Join-Path $installerRoot "Run-Installer.ps1")
  outputFile = $outputPath
  version    = $buildTimestamp
  noConsole  = $true
}
if (Test-Path -LiteralPath $iconTarget) {
  $ps2exeArgs.iconFile = $iconTarget
}

Invoke-ps2exe @ps2exeArgs

if (-not (Test-Path -LiteralPath $outputPath)) {
  throw "EXE nao foi criado: $outputPath"
}

Write-Step "Criando pacote ZIP final"
if (Test-Path -LiteralPath $bundleZipPath) {
  Remove-Item -LiteralPath $bundleZipPath -Force
}

if (-not (Test-Path -LiteralPath $payloadPath)) {
  throw "Payload ZIP nao encontrado: $payloadPath"
}

Compress-Archive -LiteralPath $outputPath, $payloadPath -DestinationPath $bundleZipPath -Force

Write-Step "Instalador gerado em: $outputPath"
Write-Step "ZIP final gerado em: $bundleZipPath"
