param(
  [switch]$Foreground,
  [switch]$Dev,
  [switch]$ServiceMode
)

$ErrorActionPreference = "Stop"
$scriptsDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptsDir
$configPath = Join-Path $projectRoot "appgpp-server.env"
$publicHost = "localhost"
$port = "3000"
$bindHost = "0.0.0.0"
$runScript = if ($Dev) { "dev" } else { "start" }

function Write-Step {
  param([string]$Message)
  Write-Host "[AppGPP] $Message" -ForegroundColor Cyan
}

function Resolve-NpmCommand {
  param([string]$ProjectRoot)

  $localNpm = Join-Path $ProjectRoot "runtime\node\npm.cmd"
  if (Test-Path -LiteralPath $localNpm) { return $localNpm }

  $systemNpm = (Get-Command npm -ErrorAction SilentlyContinue).Source
  if ($systemNpm) {
    $systemNpmCmd = if ($systemNpm -match '\.ps1$') {
      [System.IO.Path]::ChangeExtension($systemNpm, '.cmd')
    } else {
      $systemNpm
    }
    if (Test-Path -LiteralPath $systemNpmCmd) { return $systemNpmCmd }
  }

  throw "npm nao encontrado no pacote instalado nem no sistema."
}

function Resolve-NodeCommand {
  param([string]$ProjectRoot)

  $localNode = Join-Path $ProjectRoot "runtime\node\node.exe"
  if (Test-Path -LiteralPath $localNode) { return $localNode }

  $systemNode = (Get-Command node -ErrorAction SilentlyContinue).Source
  if ($systemNode -and (Test-Path -LiteralPath $systemNode)) {
    return $systemNode
  }

  throw "node nao encontrado no pacote instalado nem no sistema."
}

$modeLabel = if ($Dev) { "dev" } else { "producao" }
if ($ServiceMode) {
  $modeLabel = "$modeLabel/servico"
}
Write-Step "Iniciando servidor AppGPP em modo $modeLabel..."

$npmCmd = Resolve-NpmCommand -ProjectRoot $projectRoot
Write-Step "Runtime npm localizado em: $npmCmd"
$nodeCmd = $null
$standaloneServer = Join-Path $projectRoot ".next\standalone\server.js"
$useStandalone = (-not $Dev) -and (Test-Path -LiteralPath $standaloneServer)
if ($useStandalone) {
  $nodeCmd = Resolve-NodeCommand -ProjectRoot $projectRoot
  Write-Step "Runtime node localizado em: $nodeCmd"
  Write-Step "Servidor standalone localizado em: $standaloneServer"
}

if (Test-Path -LiteralPath $configPath) {
  foreach ($line in (Get-Content -LiteralPath $configPath)) {
    if ([string]::IsNullOrWhiteSpace($line) -or $line.TrimStart().StartsWith("#")) { continue }
    $parts = $line.Split("=", 2)
    if ($parts.Count -ne 2) { continue }
    $key = $parts[0].Trim()
    $value = $parts[1].Trim()
    switch ($key) {
      "APPGPP_PUBLIC_HOST" { if ($value) { $publicHost = $value } }
      "APPGPP_PORT" { if ($value) { $port = $value } }
      "APPGPP_BIND_HOST" { if ($value) { $bindHost = $value } }
    }
  }
}

Write-Step "Configuracao carregada: host publico=$publicHost, porta=$port, bind=$bindHost"

$existing = Get-CimInstance Win32_Process -Filter "Name='cmd.exe' or Name='node.exe'" |
  Where-Object {
    $cmd = $_.CommandLine
    if ([string]::IsNullOrWhiteSpace($cmd)) { return $false }

    if ($Dev) {
      return (($cmd -like "*npm run dev*" -or $cmd -like "*next dev*") -and $cmd -like "*$projectRoot*")
    }

    return (($cmd -like "*server.js*" -or $cmd -like "*next start*" -or $cmd -like "*npm run start*") -and $cmd -like "*$projectRoot*")
  } |
  Select-Object -First 1

if ($existing) {
  Write-Step "Servidor ja estava em execucao. Nenhuma acao necessaria."
  if ($ServiceMode) {
    try {
      Wait-Process -Id $existing.ProcessId
    } catch {
      Start-Sleep -Seconds 2
    }
  }
  exit 0
}

if ($Dev) {
  $cmdLine = "/c cd /d `"$projectRoot`" && `"$npmCmd`" run dev -- --hostname $bindHost --port $port"
} elseif ($useStandalone) {
  $cmdLine = "/c cd /d `"$projectRoot`" && set `"HOSTNAME=$bindHost`" && set `"PORT=$port`" && `"$nodeCmd`" `"$standaloneServer`""
} else {
  $cmdLine = "/c cd /d `"$projectRoot`" && `"$npmCmd`" run start -- -H $bindHost -p $port"
}

Write-Step "Executando: $cmdLine"
if ($Foreground) {
  Write-Step "Processo em primeiro plano. Pressione Ctrl+C para encerrar."
  $serverProcess = Start-Process -FilePath "cmd.exe" -ArgumentList $cmdLine -NoNewWindow -PassThru
  if ($serverProcess) {
    Wait-Process -Id $serverProcess.Id
  }
} else {
  Write-Step "Processo em segundo plano."
  $serverProcess = Start-Process -FilePath "cmd.exe" -ArgumentList $cmdLine -WindowStyle Hidden -PassThru
}

if ($ServiceMode) {
  Write-Step "Servico AppGPP aguardando encerramento do processo."
  if ($serverProcess) {
    try {
      Wait-Process -Id $serverProcess.Id
    } catch {
      Start-Sleep -Seconds 2
    }
  } else {
    Start-Sleep -Seconds 2
  }
}

Write-Step "Servidor AppGPP finalizado."
