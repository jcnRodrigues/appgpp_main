param(
  [string]$InstallDir = "C:\\AppGPP",
  [switch]$SkipNpmInstall,
  [bool]$RunBuild = $false,
  [string]$ServerHost = "",
  [int]$ServerPort = 0,
  [string]$DbHost = "",
  [int]$DbPort = 0,
  [string]$DbUser = "",
  [string]$DbPassword = "",
  [string]$DbName = ""
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

function Read-HostWithDefault {
  param(
    [string]$Prompt,
    [string]$DefaultValue
  )

  $value = Read-Host "$Prompt [$DefaultValue]"
  if ([string]::IsNullOrWhiteSpace($value)) {
    return $DefaultValue
  }
  return $value.Trim()
}

function Set-Or-ReplaceEnvValue {
  param(
    [string]$EnvFilePath,
    [string]$Key,
    [string]$Value
  )

  $lines = @()
  if (Test-Path -LiteralPath $EnvFilePath) {
    $lines = Get-Content -LiteralPath $EnvFilePath
  }

  $updated = $false
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "^\s*$Key=") {
      $lines[$i] = "$Key=`"$Value`""
      $updated = $true
      break
    }
  }

  if (-not $updated) {
    $lines += "$Key=`"$Value`""
  }

  Set-Content -LiteralPath $EnvFilePath -Value $lines -Encoding ASCII
}

Write-Step "Validando pre-requisitos"
Ensure-Command -Name "node" -HelpMessage "Instale Node.js 20.x e tente novamente."
Ensure-Command -Name "npm" -HelpMessage "Instale npm (incluido no Node.js) e tente novamente."

$nodeVersion = node --version
$nodeMajor = [int]($nodeVersion -replace '^v(\d+).*$','$1')
if ($nodeMajor -lt 20 -or $nodeMajor -ge 23) {
  throw "Node.js compativel: 20, 21 ou 22. Versao atual: $nodeVersion."
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
  if ([string]::IsNullOrWhiteSpace($ServerHost)) {
    $ServerHost = Read-HostWithDefault -Prompt "Informe o host/IP para acesso ao AppGPP" -DefaultValue "localhost"
  }
  if ($ServerPort -le 0) {
    $portText = Read-HostWithDefault -Prompt "Informe a porta do AppGPP" -DefaultValue "3000"
    $parsedPort = 0
    if (-not [int]::TryParse($portText, [ref]$parsedPort) -or $parsedPort -lt 1 -or $parsedPort -gt 65535) {
      throw "Porta invalida: $portText"
    }
    $ServerPort = $parsedPort
  }
  if ([string]::IsNullOrWhiteSpace($DbHost)) {
    $DbHost = Read-HostWithDefault -Prompt "Informe o host/IP do MySQL" -DefaultValue "localhost"
  }
  if ($DbPort -le 0) {
    $dbPortText = Read-HostWithDefault -Prompt "Informe a porta do MySQL" -DefaultValue "3306"
    $parsedDbPort = 0
    if (-not [int]::TryParse($dbPortText, [ref]$parsedDbPort) -or $parsedDbPort -lt 1 -or $parsedDbPort -gt 65535) {
      throw "Porta do MySQL invalida: $dbPortText"
    }
    $DbPort = $parsedDbPort
  }
  if ([string]::IsNullOrWhiteSpace($DbUser)) {
    $DbUser = Read-HostWithDefault -Prompt "Informe o usuario do MySQL" -DefaultValue "root"
  }
  if ([string]::IsNullOrWhiteSpace($DbPassword)) {
    $DbPassword = Read-Host "Informe a senha do MySQL (pode deixar vazio)"
  }
  if ([string]::IsNullOrWhiteSpace($DbName)) {
    $DbName = Read-HostWithDefault -Prompt "Informe o nome do banco MySQL" -DefaultValue "appgpp"
  }

  if ($DbPort -lt 1 -or $DbPort -gt 65535) {
    throw "Porta do MySQL invalida: $DbPort"
  }
  $dbUserEscaped = [Uri]::EscapeDataString($DbUser)
  $dbPasswordEscaped = [Uri]::EscapeDataString($DbPassword)
  $dbNameEscaped = [Uri]::EscapeDataString($DbName)
  $finalDbUrl = "mysql://{0}:{1}@{2}:{3}/{4}" -f $dbUserEscaped, $dbPasswordEscaped, $DbHost, $DbPort, $dbNameEscaped

  $bindHost = "0.0.0.0"
  $serverConfigPath = Join-Path $InstallDir "appgpp-server.env"
  $serverConfig = @(
    "APPGPP_PUBLIC_HOST=$ServerHost",
    "APPGPP_PORT=$ServerPort",
    "APPGPP_BIND_HOST=$bindHost"
  )
  Set-Content -LiteralPath $serverConfigPath -Value $serverConfig -Encoding ASCII
  Write-Step "Configuracao salva em appgpp-server.env (host: $ServerHost, porta: $ServerPort)"

  if ((Test-Path ".env.example") -and -not (Test-Path ".env")) {
    Write-Step "Criando .env inicial a partir de .env.example"
    Copy-Item ".env.example" ".env"
  }

  if (Test-Path ".env") {
    $envPath = Join-Path $InstallDir ".env"
    Set-Or-ReplaceEnvValue -EnvFilePath $envPath -Key "DATABASE_URL" -Value $finalDbUrl
    Write-Step "DATABASE_URL configurado com host/porta/usuario/senha/banco do MySQL"
  }

  if (-not $SkipNpmInstall) {
    Write-Step "Instalando dependencias npm"
    npm install --no-audit --no-fund
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
