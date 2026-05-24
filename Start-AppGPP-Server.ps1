param(
  [switch]$Foreground
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$configPath = Join-Path $projectRoot "appgpp-server.env"
$publicHost = "localhost"
$port = "3000"
$bindHost = "0.0.0.0"

if (Test-Path -LiteralPath $configPath) {
  foreach ($line in (Get-Content -LiteralPath $configPath)) {
    if ([string]::IsNullOrWhiteSpace($line) -or $line.TrimStart().StartsWith("#")) { continue }
    $parts = $line.Split("=", 2)
    if ($parts.Count -ne 2) { continue }
    $key = $parts[0].Trim(); $value = $parts[1].Trim()
    switch ($key) {
      "APPGPP_PUBLIC_HOST" { if ($value) { $publicHost = $value } }
      "APPGPP_PORT" { if ($value) { $port = $value } }
      "APPGPP_BIND_HOST" { if ($value) { $bindHost = $value } }
    }
  }
}

$existing = Get-CimInstance Win32_Process -Filter "Name='cmd.exe'" |
  Where-Object { $_.CommandLine -like '*npm run start*' -and $_.CommandLine -like "*$projectRoot*" } |
  Select-Object -First 1

if ($existing) { exit 0 }

$cmdLine = "/c cd /d `"$projectRoot`" && npm run start -- -H $bindHost -p $port"
if ($Foreground) {
  Start-Process -FilePath "cmd.exe" -ArgumentList $cmdLine -NoNewWindow -Wait
} else {
  Start-Process -FilePath "cmd.exe" -ArgumentList $cmdLine -WindowStyle Hidden | Out-Null
}
