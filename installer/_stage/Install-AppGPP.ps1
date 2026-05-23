param(
  [string]$InstallDir = "C:\\AppGPP",
  [switch]$SkipNpmInstall,
  [bool]$RunBuild = $false
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host "[AppGPP] $Message" -ForegroundColor Cyan
}

function Ensure-Command {
  param(
    [string]$Name,
    [string]$HelpMessage
  )

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "$Name nao encontrado. $HelpMessage"
  }
}

Write-Step "Validando pre-requisitos"
Ensure-Command -Name "node" -HelpMessage "Instale Node.js 20.x e tente novamente."
Ensure-Command -Name "npm" -HelpMessage "Instale npm (incluido no Node.js) e tente novamente."

$nodeVersion = node --version
$nodeMajor = [int]($nodeVersion -replace '^v(\\d+).*$','$1')
if ($nodeMajor -lt 20) {
  throw "Node.js 20+ requerido. Versao atual: $nodeVersion"
}

$sourceRoot = Split-Path -Parent $PSCommandPath
Write-Step "Copiando arquivos para $InstallDir"
New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null

$excludeDirs = @(".git", ".next", "node_modules", "installer", ".netlify", ".vscode", "dist")
$excludeFiles = @("*.log", "npm-debug.log*", "*.tmp*", "tsconfig.tsbuildinfo")

$robocopyArgs = @(
  $sourceRoot,
  $InstallDir,
  "/E",
  "/R:2",
  "/W:1",
  "/NFL",
  "/NDL",
  "/NJH",
  "/NJS",
  "/NP"
)

foreach ($dir in $excludeDirs) { $robocopyArgs += @("/XD", (Join-Path $sourceRoot $dir)) }
foreach ($file in $excludeFiles) { $robocopyArgs += @("/XF", $file) }

& robocopy @robocopyArgs | Out-Null
$rc = $LASTEXITCODE
if ($rc -ge 8) {
  throw "Falha ao copiar arquivos (robocopy exit code: $rc)"
}

Push-Location $InstallDir
try {
  if (-not $SkipNpmInstall) {
    Write-Step "Instalando dependencias npm"
    npm install --no-audit --no-fund
  }

  if (Test-Path ".env.example" -and -not (Test-Path ".env")) {
    Write-Step "Criando .env inicial a partir de .env.example"
    Copy-Item ".env.example" ".env"
  }

  if ($RunBuild) {
    Write-Step "Gerando build de producao"
    npm run build
  }

  if (Test-Path "Criar-Atalho-AreaTrabalho.ps1") {
    Write-Step "Criando atalho na area de trabalho"
    powershell -NoProfile -ExecutionPolicy Bypass -File ".\\Criar-Atalho-AreaTrabalho.ps1"
  }
} finally {
  Pop-Location
}

Write-Step "Instalacao concluida"
Write-Host "Inicie por: $InstallDir\\Abrir-AppGPP.cmd" -ForegroundColor Green
