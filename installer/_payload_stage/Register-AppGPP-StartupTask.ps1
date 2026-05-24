param(
  [string]$TaskName = "AppGPP-Server",
  [string]$InstallDir = "C:\\AppGPP"
)

$ErrorActionPreference = "Stop"
$startScript = Join-Path $InstallDir "Start-AppGPP-Server.ps1"
if (-not (Test-Path -LiteralPath $startScript)) {
  throw "Script nao encontrado: $startScript"
}

$taskCmd = "powershell -NoProfile -ExecutionPolicy Bypass -File `"$startScript`""

schtasks /Delete /TN $TaskName /F >$null 2>&1
schtasks /Create /TN $TaskName /SC ONSTART /RU SYSTEM /RL HIGHEST /TR $taskCmd /F | Out-Null
Write-Host "Tarefa criada: $TaskName"
