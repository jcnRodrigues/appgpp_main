param(
  [switch]$Foreground,
  [switch]$Dev
)

$ErrorActionPreference = "Stop"

function Resolve-AppRoot {
  $candidates = @(
    $PSScriptRoot,
    $PSCommandPath,
    $MyInvocation.MyCommand.Path,
    [System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName,
    (Get-Location).Path
  )

  foreach ($candidate in $candidates) {
    if ([string]::IsNullOrWhiteSpace($candidate)) { continue }

    $resolved = $candidate
    if (Test-Path -LiteralPath $candidate) {
      $resolved = $candidate
    } elseif (Test-Path -LiteralPath (Split-Path -Parent $candidate)) {
      $resolved = Split-Path -Parent $candidate
    } else {
      continue
    }

    $basePath = if ((Get-Item -LiteralPath $resolved).PSIsContainer) { $resolved } else { Split-Path -Parent $resolved }
    if (-not [string]::IsNullOrWhiteSpace($basePath) -and (Test-Path -LiteralPath $basePath)) {
      return (Get-Item -LiteralPath $basePath).FullName
    }
  }

  return ""
}

$appRoot = Resolve-AppRoot
if ([string]::IsNullOrWhiteSpace($appRoot)) {
  throw "Nao foi possivel identificar a pasta raiz do AppGPP."
}

$scriptCandidates = @(
  (Join-Path $appRoot "scripts\Start-AppGPP-Server.ps1"),
  (Join-Path $appRoot "powershell-scripts\Start-AppGPP-Server.ps1")
)
$startScript = $scriptCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
$configPath = Join-Path $appRoot "appgpp-server.env"
$publicHost = "localhost"
$port = "3000"

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
    }
  }
}

if ($Dev) {
  $publicHost = "localhost"
}

if ([string]::IsNullOrWhiteSpace($startScript)) {
  throw "Nao foi possivel localizar o script de inicio em: $($scriptCandidates -join ', ')"
}

$startArgs = @(
  "-NoProfile",
  "-ExecutionPolicy", "Bypass",
  "-File", $startScript
)
if ($Foreground) {
  $startArgs += "-Foreground"
}
if ($Dev) {
  $startArgs += "-Dev"
}

if ($Foreground) {
  Start-Process -FilePath "powershell" -ArgumentList $startArgs -NoNewWindow -Wait
} else {
  $hiddenArgs = @(
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-WindowStyle", "Hidden"
  ) + $startArgs
  Start-Process -FilePath "powershell" -ArgumentList $hiddenArgs -WindowStyle Hidden | Out-Null
}

Start-Sleep -Seconds 2
Start-Process "http://$publicHost`:$port"
