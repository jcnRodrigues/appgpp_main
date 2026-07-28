param(
  [switch]$Dev
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Resolve-AppRoot {
  $candidates = @(
    $env:APPGPP_INSTALL_DIR,
    "C:\AppGPP",
    $PSScriptRoot,
    $PSCommandPath,
    $MyInvocation.MyCommand.Path,
    [System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName,
    (Get-Location).Path
  )

  foreach ($candidate in $candidates) {
    if ([string]::IsNullOrWhiteSpace($candidate)) { continue }

    $resolved = $candidate
    if (-not (Test-Path -LiteralPath $candidate)) {
      $parent = Split-Path -Parent $candidate
      if (-not (Test-Path -LiteralPath $parent)) { continue }
      $resolved = $parent
    }

    $item = Get-Item -LiteralPath $resolved -ErrorAction SilentlyContinue
    if (-not $item) { continue }

    $basePath = if ($item.PSIsContainer) { $item.FullName } else { Split-Path -Parent $item.FullName }
    if ([string]::IsNullOrWhiteSpace($basePath)) { continue }

    if ((Test-Path -LiteralPath (Join-Path $basePath "package.json")) -and
      (Test-Path -LiteralPath (Join-Path $basePath "scripts\Start-AppGPP-Server.ps1"))) {
      return (Get-Item -LiteralPath $basePath).FullName
    }
  }

  return ""
}

$projectRoot = Resolve-AppRoot
$scriptsDir = Join-Path $projectRoot "scripts"
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
$serviceName = "AppGPP-Service"
$runScript = if ($Dev) { "dev" } else { "start" }

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

$npmCmd = $null
$nodeCmd = $null
$standaloneServer = Join-Path $projectRoot ".next\standalone\server.js"
$useStandalone = (-not $Dev) -and (Test-Path -LiteralPath $standaloneServer)
try {
  $npmCmd = Resolve-NpmCommand -ProjectRoot $projectRoot
  if ($useStandalone) {
    $nodeCmd = Resolve-NodeCommand -ProjectRoot $projectRoot
  }
} catch {
  [System.Windows.Forms.MessageBox]::Show(
    "Nao foi possivel localizar o runtime do Node.js do AppGPP.`n`nInstale o pacote completo ou o Node.js 20+ no sistema.",
    "AppGPP",
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Error
  ) | Out-Null
  exit 1
}

$existingService = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
$existingServiceInfo = Get-CimInstance Win32_Service -Filter "Name='$serviceName'" -ErrorAction SilentlyContinue
$servicePathMatches = $false
if ($existingServiceInfo) {
  $servicePathMatches = $existingServiceInfo.PathName -and $existingServiceInfo.PathName -like "*AppGPP-ServiceHost.exe*"
}

if ($existingService -and -not $Dev -and $servicePathMatches) {
  if ($existingService.Status -ne 'Running') {
    try { Start-Service -Name $serviceName } catch {}
  }
  $server = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
} else {
  if ($Dev) {
    $cmdLine = "/c cd /d `"$projectRoot`" && `"$npmCmd`" run dev -- --hostname $bindHost --port $port"
  } elseif ($useStandalone) {
    $cmdLine = "/c cd /d `"$projectRoot`" && set `"HOSTNAME=$bindHost`" && set `"PORT=$port`" && `"$nodeCmd`" `"$standaloneServer`""
  } else {
    $cmdLine = "/c cd /d `"$projectRoot`" && `"$npmCmd`" run start -- -H $bindHost -p $port"
  }
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
$logsItem = $menu.Items.Add("Abrir Logs do Sistema")
$exitItem = $menu.Items.Add("Encerrar AppGPP")
$notifyIcon.ContextMenuStrip = $menu

$openAction = {
  Start-Process $url | Out-Null
}

$logsAction = {
  Start-Process -FilePath ($url.TrimEnd('/') + '/sistema/logs/') | Out-Null
}

$exitAction = {
  $stopScript = Join-Path $scriptsDir "Stop-AppGPP-Server.ps1"
  if (Test-Path -LiteralPath $stopScript) {
    try {
      if ($existingService -and -not $Dev) {
        $stopArgs = @(
          "-NoProfile",
          "-ExecutionPolicy", "Bypass",
          "-File", $stopScript,
          "-InstallDir", $projectRoot
        )
        Start-Process -FilePath "powershell.exe" -Verb RunAs -ArgumentList $stopArgs -Wait | Out-Null
      } else {
        & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $stopScript -InstallDir $projectRoot
      }
    } catch {
      if ($existingService -and -not $Dev) {
        try {
          $stopArgs = @(
            "-NoProfile",
            "-ExecutionPolicy", "Bypass",
            "-File", $stopScript,
            "-InstallDir", $projectRoot
          )
          Start-Process -FilePath "powershell.exe" -ArgumentList $stopArgs -Wait | Out-Null
        } catch {}
      }
    }
  }
  $notifyIcon.Visible = $false
  $notifyIcon.Dispose()
  [System.Windows.Forms.Application]::Exit()
}

$null = $openItem.add_Click($openAction)
$null = $logsItem.add_Click($logsAction)
$null = $exitItem.add_Click($exitAction)
$null = $notifyIcon.add_DoubleClick($openAction)

$balloonText = if ($existingService -and -not $Dev) { "Servico AppGPP-Service em execucao." } else { "Servidor iniciado na bandeja do sistema." }
if ($existingService -and -not $Dev -and -not $servicePathMatches) {
  $balloonText = "Servico antigo detectado. O AppGPP abriu em modo local."
}
$notifyIcon.ShowBalloonTip(3000, "AppGPP", $balloonText, [System.Windows.Forms.ToolTipIcon]::Info)

Start-Sleep -Seconds 6
Start-Process $url | Out-Null

[System.Windows.Forms.Application]::Run()

$mutex.ReleaseMutex()
$mutex.Dispose()
