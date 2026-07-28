param(
  [string]$ServiceName = 'AppGPP-Service',
  [string]$DisplayName = 'AppGPP-Service'
)

$ErrorActionPreference = 'Stop'

function Test-IsAdministrator {
  $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = [Security.Principal.WindowsPrincipal]::new($identity)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-IsAdministrator)) {
  throw 'A criacao do servico AppGPP-Service exige permissao de administrador.'
}

$scriptsDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptsDir
$buildScript = Join-Path $projectRoot 'scripts\Build-AppGPP-ServiceHost.ps1'
$serviceHost = Join-Path $projectRoot 'scripts\AppGPP-ServiceHost.exe'

if (-not (Test-Path -LiteralPath $buildScript)) {
  throw "Script nao encontrado: $buildScript"
}

$powershellPath = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
if (-not (Test-Path -LiteralPath $powershellPath)) {
  throw "Executavel do PowerShell nao encontrado: $powershellPath"
}

$buildArgs = @(
  '-NoProfile',
  '-ExecutionPolicy', 'Bypass',
  '-File', $buildScript,
  '-InstallDir', $projectRoot
)
 $buildOutput = & $powershellPath @buildArgs
if ($LASTEXITCODE -ne 0) {
  throw "Falha ao compilar o host do servico AppGPP."
}

if ($buildOutput) {
  $generatedHost = ($buildOutput | Where-Object { $_ -match 'AppGPP-ServiceHost-.*\.exe$' } | Select-Object -Last 1)
  if ($generatedHost) {
    $serviceHost = $generatedHost.Trim()
  }
}

if (-not (Test-Path -LiteralPath $serviceHost)) {
  throw "Host do servico nao encontrado: $serviceHost"
}

$binaryPath = '"' + $serviceHost + '"'
$existing = Get-CimInstance Win32_Service -Filter "Name='$ServiceName'" -ErrorAction SilentlyContinue
if ($existing) {
  $wasRunning = $existing.State -eq 'Running'

  try {
    sc.exe config $ServiceName obj= LocalSystem password= "" | Out-Null
    sc.exe config $ServiceName binPath= $binaryPath start= auto | Out-Null
  } catch {
    # Se o binPath nao puder ser atualizado, mantem a instalacao existente.
  }

  if ($wasRunning) {
    try {
      Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue
      Start-Sleep -Seconds 2
    } catch {
      # Ignora falha na parada para tentar subir a versao atualizada.
    }
  }

  try { Start-Service -Name $ServiceName -ErrorAction SilentlyContinue } catch {}

  Write-Host "Servico ja existente: $ServiceName"
  return
}

New-Service -Name $ServiceName -DisplayName $DisplayName -BinaryPathName $binaryPath -StartupType Automatic | Out-Null
try {
  sc.exe config $ServiceName obj= LocalSystem password= "" | Out-Null
  sc.exe description $ServiceName 'Servidor Windows do AppGPP' | Out-Null
} catch {
  # Descricao opcional.
}
Start-Service -Name $ServiceName

Write-Host "Servico criado e iniciado: $ServiceName"
