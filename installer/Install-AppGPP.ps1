param(
  [string]$InstallDir = "C:\\AppGPP",
  [switch]$SkipNpmInstall,
  [bool]$RunBuild = $true,
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

function Get-NodeVersionFromPayload {
  param([string]$SourceRoot)

  $versionPath = Join-Path $SourceRoot "runtime\node-version.txt"
  if (Test-Path -LiteralPath $versionPath) {
    $value = (Get-Content -LiteralPath $versionPath -Raw).Trim()
    if (-not [string]::IsNullOrWhiteSpace($value)) { return $value }
  }
  return ""
}

function Ensure-PortableNode {
  param(
    [string]$SourceRoot,
    [string]$InstallDir
  )

  $bundledRuntimeDir = Join-Path $SourceRoot "runtime\node"
  $bundledNodeExe = Join-Path $bundledRuntimeDir "node.exe"
  $bundledNpmCmd = Join-Path $bundledRuntimeDir "npm.cmd"
  if ((Test-Path -LiteralPath $bundledNodeExe) -and (Test-Path -LiteralPath $bundledNpmCmd)) {
    return [pscustomobject]@{
      NodeExe = $bundledNodeExe
      NpmCmd  = $bundledNpmCmd
      Source  = "bundled"
    }
  }

  $runtimeDir = Join-Path $InstallDir "runtime\node"
  $nodeExe = Join-Path $runtimeDir "node.exe"
  $npmCmd = Join-Path $runtimeDir "npm.cmd"

  if ((Test-Path -LiteralPath $nodeExe) -and (Test-Path -LiteralPath $npmCmd)) {
    return [pscustomobject]@{
      NodeExe = $nodeExe
      NpmCmd  = $npmCmd
      Source  = "local"
    }
  }

  $systemNode = (Get-Command node -ErrorAction SilentlyContinue).Source
  if ($systemNode -and (Test-Path -LiteralPath $systemNode)) {
    $systemNpm = Join-Path (Split-Path -Parent $systemNode) "npm.cmd"
    return [pscustomobject]@{
      NodeExe = $systemNode
      NpmCmd  = $systemNpm
      Source  = "system"
    }
  }

  throw "Nao foi possivel localizar o runtime Node.js no pacote, na instalacao ou no sistema."
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

function Test-MySqlConnection {
  param(
    [string]$NodeExe,
    [string]$InstallDir,
    [string]$DbHost,
    [int]$DbPort,
    [string]$DbUser,
    [string]$DbPassword,
    [string]$DbName
  )

  $dbNameClean = $DbName.Trim()
  if ([string]::IsNullOrWhiteSpace($dbNameClean)) {
    throw "Nome do banco MySQL nao informado."
  }

  # Usa here-string literal para preservar exatamente os caracteres do JS.
  $testConnectionScript = @'
const mysql = require('mysql2/promise');

const [,, host, port, user, password, database] = process.argv;

async function main() {
  const connection = await mysql.createConnection({
    host,
    port: Number(port),
    user,
    password,
    database
  });

  await connection.query('SELECT 1');
  await connection.end();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error && error.message ? error.message : String(error));
    process.exit(1);
  });
'@

  $scriptPath = Join-Path $InstallDir (".appgpp-test-mysql-" + [guid]::NewGuid().ToString("N") + ".js")
  $errPath = Join-Path $env:TEMP (".appgpp-test-mysql-" + [guid]::NewGuid().ToString("N") + ".err.log")
  Set-Content -LiteralPath $scriptPath -Value $testConnectionScript -Encoding UTF8

  try {
    $proc = Start-Process -FilePath $NodeExe -ArgumentList @($scriptPath, $DbHost, $DbPort, $DbUser, $DbPassword, $dbNameClean) -RedirectStandardError $errPath -Wait -PassThru -WorkingDirectory $InstallDir
    if ($proc.ExitCode -ne 0) {
      $details = ""
      if (Test-Path -LiteralPath $errPath) { $details = (Get-Content -LiteralPath $errPath -Raw) }
      throw "Falha ao conectar ao banco MySQL '$dbNameClean'. $details"
    }
  } finally {
    Remove-Item -LiteralPath $scriptPath -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $errPath -Force -ErrorAction SilentlyContinue
  }
}

function Test-CriticalInstallArtifacts {
  param([string]$InstallDir)

  $criticalPaths = @(
    (Join-Path $InstallDir "package.json"),
    (Join-Path $InstallDir ".next"),
    (Join-Path $InstallDir "node_modules"),
    (Join-Path $InstallDir "node_modules\.bin\prisma.cmd"),
    (Join-Path $InstallDir "scripts"),
    (Join-Path $InstallDir "prisma"),
    (Join-Path $InstallDir "public")
  )

  foreach ($path in $criticalPaths) {
    if (-not (Test-Path -LiteralPath $path)) {
      return $false
    }
  }

  return $true
}

function Get-InstallCopyCandidates {
  param(
    [string]$SourceRoot
  )

  $excludeDirs = @(".git", "installer", ".vscode", "dist", "_backups")
  $excludeFiles = @("*.log", "npm-debug.log*", "*.tmp*", "tsconfig.tsbuildinfo")

  Get-ChildItem -LiteralPath $SourceRoot -Recurse -Force | Where-Object {
    $relative = $_.FullName.Substring($SourceRoot.Length).TrimStart('\')
    if ([string]::IsNullOrWhiteSpace($relative)) { return $false }

    $firstSegment = ($relative -split '[\\/]', 2)[0]
    if ($_.PSIsContainer) {
      return -not ($excludeDirs -contains $firstSegment)
    }

    foreach ($pattern in $excludeFiles) {
      if ($_.Name -like $pattern) {
        return $false
      }
    }

    return -not ($excludeDirs -contains $firstSegment)
  }
}

function Copy-InstallFiles {
  param(
    [string]$SourceRoot,
    [string]$InstallDir
  )

  $sourcePath = (Resolve-Path -LiteralPath $SourceRoot).Path.TrimEnd('\')
  $installPath = $InstallDir.TrimEnd('\')
  $entries = @(Get-InstallCopyCandidates -SourceRoot $sourcePath)
  $files = $entries | Where-Object { -not $_.PSIsContainer }
  $total = @($files).Count

  if ($total -le 0) {
    throw "Nenhum arquivo encontrado para copiar em $sourcePath"
  }

  Write-Step "Transferindo $total arquivo(s) para $installPath"

  $index = 0
  foreach ($file in $files) {
    $index++
    $relative = $file.FullName.Substring($sourcePath.Length).TrimStart('\')
    $targetPath = Join-Path $installPath $relative
    $targetDir = Split-Path -Parent $targetPath

    if (-not (Test-Path -LiteralPath $targetDir)) {
      New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    Write-Step "[$index/$total] Salvando: $relative"
    Copy-Item -LiteralPath $file.FullName -Destination $targetPath -Force
  }

  Write-Step "Transferencia concluida. $total arquivo(s) copiados."
}

Write-Step "Validando pre-requisitos"
$sourceRoot = Split-Path -Parent $PSCommandPath
$nodeVersionFromPayload = Get-NodeVersionFromPayload -SourceRoot $sourceRoot
$nodeRuntime = Ensure-PortableNode -SourceRoot $sourceRoot -InstallDir $InstallDir
$nodeExe = $nodeRuntime.NodeExe
$npmCmd = $nodeRuntime.NpmCmd

$nodeVersion = & $nodeExe --version
$nodeMajor = [int]($nodeVersion -replace '^v(\d+).*$','$1')
if ($nodeMajor -lt 20 -or $nodeMajor -ge 23) {
  throw "Node.js compativel: 20, 21 ou 22. Versao atual: $nodeVersion."
}

Write-Step "Copiando arquivos para $InstallDir"
New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
Copy-InstallFiles -SourceRoot $sourceRoot -InstallDir $InstallDir
if (-not (Test-CriticalInstallArtifacts -InstallDir $InstallDir)) {
  throw "Falha ao copiar arquivos. Alguns artefatos criticos nao foram encontrados apos a transferencia."
}

Push-Location $InstallDir
try {
  $scriptDir = Join-Path $InstallDir "scripts"
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

  Write-Step "Validando conexao com banco MySQL existente"
  Test-MySqlConnection -NodeExe $nodeExe -InstallDir $InstallDir -DbHost $DbHost -DbPort $DbPort -DbUser $DbUser -DbPassword $DbPassword -DbName $DbName

  $prismaCmd = Join-Path $InstallDir "node_modules\.bin\prisma.cmd"
  if (Test-Path -LiteralPath $prismaCmd) {
    Write-Step "Aplicando migrations no MySQL"
    & $prismaCmd migrate deploy
  } else {
    throw "Prisma nao encontrado no pacote instalado. O instalador offline precisa incluir node_modules."
  }

  if (Test-Path (Join-Path $scriptDir "Register-AppGPP-StartupTask.ps1")) {
    Write-Step "Registrando inicializacao automatica do AppGPP no boot do servidor"
    powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $scriptDir "Register-AppGPP-StartupTask.ps1") -InstallDir $InstallDir
  }

  if (Test-Path (Join-Path $scriptDir "Criar-Atalho-AreaTrabalho.ps1")) {
    Write-Step "Criando atalho na area de trabalho"
    powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $scriptDir "Criar-Atalho-AreaTrabalho.ps1")
  }
} finally {
  Pop-Location
}

Write-Step "Instalacao concluida"
Write-Host "Inicie por: $InstallDir\\scripts\\Abrir-AppGPP.cmd" -ForegroundColor Green
