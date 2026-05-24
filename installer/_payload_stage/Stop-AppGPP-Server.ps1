param(
  [string]$InstallDir = "C:\\AppGPP"
)

$ErrorActionPreference = "Stop"

$taskName = "AppGPP-Server"
$startScript = Join-Path $InstallDir "Start-AppGPP-Server.ps1"

# Stop scheduled task if running
try {
  schtasks /End /TN $taskName >$null 2>&1
} catch {}

# Stop node/cmd processes related to app
Get-CimInstance Win32_Process -Filter "Name='cmd.exe'" |
  Where-Object { $_.CommandLine -like "*$InstallDir*" -and ($_.CommandLine -like '*npm run start*' -or $_.CommandLine -like '*Start-AppGPP-Server.ps1*') } |
  ForEach-Object {
    try { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } catch {}
  }

Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -like "*$InstallDir*" } |
  ForEach-Object {
    try { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } catch {}
  }

Write-Host "AppGPP parado com sucesso."
