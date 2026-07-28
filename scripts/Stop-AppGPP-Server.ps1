param(
  [string]$InstallDir = "C:\\AppGPP"
)

$ErrorActionPreference = "Stop"

$taskName = "AppGPP-Server"
$serviceName = "AppGPP-Service"
$startScript = Join-Path $InstallDir "scripts\Start-AppGPP-Server.ps1"
$currentPid = $PID

# Stop scheduled task if running
try {
  schtasks /End /TN $taskName >$null 2>&1
} catch {}

try {
  $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
  if ($service) {
    Stop-Service -Name $serviceName -Force -ErrorAction SilentlyContinue
    Write-Host "Servico parado: $serviceName"
  }
} catch {}

function Stop-ProcessesByMatch {
  param(
    [string[]]$Names,
    [string[]]$Patterns,
    [int]$ExcludePid = 0
  )

  foreach ($name in $Names) {
    Get-CimInstance Win32_Process -Filter "Name='$name'" |
      Where-Object {
        if ($ExcludePid -gt 0 -and $_.ProcessId -eq $ExcludePid) {
          return $false
        }

        $cmd = $_.CommandLine
        if ([string]::IsNullOrWhiteSpace($cmd)) { return $false }
        foreach ($pattern in $Patterns) {
          if ($cmd -like $pattern) { return $true }
        }
        return $false
      } |
      ForEach-Object {
        try { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } catch {}
      }
  }
}

$patterns = @(
  "*Start-AppGPP-Server.ps1*",
  "*AppGPP-Tray.ps1*",
  "*AppGPP-Start.ps1*",
  "*AppGPP-Start.exe*",
  "*AppGPP-ServiceHost.exe*",
  "*npm run start*",
  "*npm run dev*",
  "*server.js*",
  "*next start*",
  "*next dev*"
)

Stop-ProcessesByMatch -Names @('cmd.exe','node.exe','powershell.exe','pwsh.exe') -Patterns $patterns -ExcludePid $currentPid

# Also try to stop the launcher if it is still running from the install dir.
Get-CimInstance Win32_Process -Filter "Name='AppGPP-Start.exe'" |
  Where-Object { $_.ExecutablePath -and $_.ExecutablePath -like "*$InstallDir*" } |
  ForEach-Object {
    try { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } catch {}
  }

Write-Host "AppGPP parado com sucesso."
