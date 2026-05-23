Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

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
    $key = $parts[0].Trim()
    $value = $parts[1].Trim()
    switch ($key) {
      "APPGPP_PUBLIC_HOST" { if ($value) { $publicHost = $value } }
      "APPGPP_PORT" { if ($value) { $port = $value } }
      "APPGPP_BIND_HOST" { if ($value) { $bindHost = $value } }
    }
  }
}

$url = "http://$publicHost`:$port"
$trayIconPath = Join-Path $projectRoot "public\Imagens\AppGPP.ico"

$mutexName = "Global\AppGPP_Tray_Icon"
$createdNew = $false
$mutex = New-Object System.Threading.Mutex($true, $mutexName, [ref]$createdNew)
if (-not $createdNew) {
  exit 0
}

function Stop-ProcessTree {
  param(
    [Parameter(Mandatory = $true)]
    [int]$Pid
  )

  try {
    Start-Process -FilePath "taskkill.exe" -ArgumentList "/PID $Pid /T /F" -WindowStyle Hidden -Wait | Out-Null
  } catch {
    # Ignora falhas no encerramento forçado.
  }
}

try {
  $npmCmd = Get-Command npm -ErrorAction Stop
} catch {
  [System.Windows.Forms.MessageBox]::Show(
    "npm nao encontrado. Instale o Node.js 20+ e tente novamente.",
    "AppGPP",
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Error
  ) | Out-Null
  exit 1
}

# Reaproveita servidor existente quando ja estiver rodando.
$existing = Get-CimInstance Win32_Process -Filter "Name='cmd.exe'" |
  Where-Object { $_.CommandLine -like '*npm run dev*' -and $_.CommandLine -like "*$projectRoot*" } |
  Select-Object -First 1

if ($existing) {
  $server = Get-Process -Id $existing.ProcessId -ErrorAction SilentlyContinue
} else {
  $cmdLine = "/c cd /d `"$projectRoot`" && set APPGPP_BIND_HOST=$bindHost && set APPGPP_PORT=$port && npm run dev -- --hostname $bindHost --port $port"
  $server = Start-Process -FilePath "cmd.exe" -ArgumentList $cmdLine -WindowStyle Hidden -PassThru
}

$notifyIcon = New-Object System.Windows.Forms.NotifyIcon
if (Test-Path -LiteralPath $trayIconPath) {
  $notifyIcon.Icon = New-Object System.Drawing.Icon($trayIconPath)
} else {
  $notifyIcon.Icon = [System.Drawing.SystemIcons]::Application
}
$notifyIcon.Text = "AppGPP em execucao"
$notifyIcon.Visible = $true

$menu = New-Object System.Windows.Forms.ContextMenuStrip
$openItem = $menu.Items.Add("Abrir App")
$exitItem = $menu.Items.Add("Encerrar AppGPP")
$notifyIcon.ContextMenuStrip = $menu

$openAction = {
  Start-Process $url | Out-Null
}

$exitAction = {
  if ($server -and -not $server.HasExited) {
    Stop-ProcessTree -Pid $server.Id
  }
  $notifyIcon.Visible = $false
  $notifyIcon.Dispose()
  [System.Windows.Forms.Application]::Exit()
}

$null = $openItem.add_Click($openAction)
$null = $exitItem.add_Click($exitAction)
$null = $notifyIcon.add_DoubleClick($openAction)

$balloonText = if ($existing) { "AppGPP ja estava em execucao." } else { "Servidor iniciado na bandeja do sistema." }
$notifyIcon.ShowBalloonTip(3000, "AppGPP", $balloonText, [System.Windows.Forms.ToolTipIcon]::Info)

Start-Sleep -Seconds 6
Start-Process $url | Out-Null

[System.Windows.Forms.Application]::Run()

$mutex.ReleaseMutex()
$mutex.Dispose()
