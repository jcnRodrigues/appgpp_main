param(
  [string]$ServerUrl = 'http://localhost:3000',
  [string]$Token = '',
  [string]$Hostname = $env:COMPUTERNAME,
  [switch]$Install,
  [switch]$InstallService,
  [switch]$UninstallService,
  [switch]$ServiceMode,
  [string]$TaskName = 'AppGPP Host Inventory Agent',
  [string]$ServiceName = 'AppGPP Host Inventory Agent',
  [string]$ServiceDisplayName = 'AppGPP Host Inventory Agent',
  [int]$IntervalMinutes = 60,
  [switch]$RunNow
)

$ErrorActionPreference = 'Stop'

$script:HostInventoryAgentScriptPath = $null
try {
  if ($PSCommandPath) {
    $script:HostInventoryAgentScriptPath = $PSCommandPath
  } elseif ($MyInvocation.MyCommand.Path) {
    $script:HostInventoryAgentScriptPath = $MyInvocation.MyCommand.Path
  } elseif ($PSScriptRoot) {
    $script:HostInventoryAgentScriptPath = Join-Path $PSScriptRoot 'HostInventoryAgent.ps1'
  }
} catch {}

function Get-PrimaryIpAddress {
  try {
    $configs = Get-CimInstance Win32_NetworkAdapterConfiguration | Where-Object { $_.IPEnabled -eq $true }
    foreach ($cfg in $configs) {
      $ip = @($cfg.IPAddress | Where-Object { $_ -and $_ -notlike '169.254*' -and $_ -notlike 'fe80*' })[0]
      if ($ip) { return [string]$ip }
    }
  } catch {}

  return $null
}

function Convert-MonitorIdText {
  param([object[]]$Value)

  if ($null -eq $Value) {
    return $null
  }

  $chars = @($Value | Where-Object { $_ -and $_ -ne 0 } | ForEach-Object { [char]$_ })
  if ($chars.Count -eq 0) {
    return $null
  }

  return -join $chars
}

function Get-MonitorInventory {
  $items = @()

  try {
    $monitors = Get-CimInstance -Namespace root\wmi -ClassName WmiMonitorID
    foreach ($monitor in $monitors) {
      $name = Convert-MonitorIdText $monitor.UserFriendlyName
      if (-not $name) {
        $name = Convert-MonitorIdText $monitor.ProductCodeID
      }
      if (-not $name) {
        $name = 'Monitor'
      }
      $manufacturer = Convert-MonitorIdText $monitor.ManufacturerName
      $serial = Convert-MonitorIdText $monitor.SerialNumberID

      $items += [pscustomobject]@{
        Name = $name
        Manufacturer = $manufacturer
        Serial = $serial
        InstanceName = $monitor.InstanceName
        Active = $true
        Source = 'WmiMonitorID'
      }
    }
  } catch {}

  if ($items.Count -gt 0) {
    return $items
  }

  try {
    $legacyMonitors = Get-CimInstance Win32_DesktopMonitor
    foreach ($monitor in $legacyMonitors) {
      $items += [pscustomobject]@{
        Name = if ($monitor.Caption) { $monitor.Caption } else { 'Monitor' }
        Manufacturer = $monitor.MonitorManufacturer
        Serial = $monitor.PNPDeviceID
        InstanceName = $monitor.PNPDeviceID
        Active = $true
        Source = 'Win32_DesktopMonitor'
      }
    }
  } catch {}

  return $items
}

function Get-PnpInventoryByClass {
  param([Parameter(Mandatory=$true)][string]$ClassName)

  $items = @()

  if (Get-Command Get-PnpDevice -ErrorAction SilentlyContinue) {
    try {
      $devices = Get-PnpDevice -Class $ClassName -PresentOnly -ErrorAction Stop
      foreach ($device in $devices) {
        $items += [pscustomobject]@{
          Name = $device.FriendlyName
          Manufacturer = $device.Manufacturer
          InstanceId = $device.InstanceId
          Status = $device.Status
          Source = 'Get-PnpDevice'
        }
      }

      if ($items.Count -gt 0) {
        return $items
      }
    } catch {}
  }

  return $items
}

function Get-KeyboardInventory {
  $items = Get-PnpInventoryByClass -ClassName 'Keyboard'
  if ($items.Count -gt 0) {
    return $items
  }

  try {
    return @(
      Get-CimInstance Win32_Keyboard | ForEach-Object {
        [pscustomobject]@{
          Name = if ($_.Description) { $_.Description } else { 'Teclado' }
          Manufacturer = $_.Manufacturer
          InstanceId = $_.DeviceID
          Status = $_.Status
          Source = 'Win32_Keyboard'
        }
      }
    )
  } catch {
    return @()
  }
}

function Get-MouseInventory {
  $items = Get-PnpInventoryByClass -ClassName 'Mouse'
  if ($items.Count -gt 0) {
    return $items
  }

  try {
    return @(
      Get-CimInstance Win32_PointingDevice | ForEach-Object {
        [pscustomobject]@{
          Name = if ($_.Description) { $_.Description } else { 'Mouse' }
          Manufacturer = $_.Manufacturer
          InstanceId = $_.DeviceID
          Status = $_.Status
          Source = 'Win32_PointingDevice'
        }
      }
    )
  } catch {
    return @()
  }
}

function Get-InventoryPayload {
  $cs = $null
  $os = $null
  $bios = $null
  try { $cs = Get-CimInstance Win32_ComputerSystem } catch {}
  try { $os = Get-CimInstance Win32_OperatingSystem } catch {}
  try { $bios = Get-CimInstance Win32_BIOS } catch {}

  $adapters = @()
  try {
    $adapters = Get-CimInstance Win32_NetworkAdapterConfiguration |
      Where-Object { $_.IPEnabled -eq $true } |
      ForEach-Object {
        [pscustomobject]@{
          Description = $_.Description
          MacAddress = $_.MACAddress
          IpAddress = @($_.IPAddress | Where-Object { $_ })
          DefaultGateway = @($_.DefaultIPGateway | Where-Object { $_ })
          DnsDomain = $_.DNSDomain
        }
      }
  } catch {}

  $monitors = Get-MonitorInventory
  $keyboards = Get-KeyboardInventory
  $mouses = Get-MouseInventory

  [pscustomobject]@{
    hostname = $Hostname
    computerName = $env:COMPUTERNAME
    domain = if ($cs) { $cs.Domain } else { $null }
    usuario = if ($cs -and $cs.UserName) { $cs.UserName } else { $null }
    fabricante = if ($cs) { $cs.Manufacturer } else { $null }
    modelo = if ($cs) { $cs.Model } else { $null }
    serial = if ($bios) { $bios.SerialNumber } else { $null }
    sistemaOperacional = if ($os) { $os.Caption } else { $null }
    versaoOS = if ($os) { $os.Version } else { $null }
    buildNumber = if ($os) { $os.BuildNumber } else { $null }
    ultimoBoot = if ($os) { $os.LastBootUpTime } else { $null }
    ipPrincipal = Get-PrimaryIpAddress
    adaptadores = $adapters
    perifericos = [pscustomobject]@{
      monitor = $monitors
      teclado = $keyboards
      mouse = $mouses
    }
    collectedAt = (Get-Date).ToString('o')
  }
}

function Save-LocalSnapshot {
  param([Parameter(Mandatory=$true)]$Payload)

  $baseDir = Join-Path $env:ProgramData 'AppGPP\HostInventory'
  New-Item -ItemType Directory -Path $baseDir -Force | Out-Null
  $safeName = ($Payload.hostname -replace '[^A-Za-z0-9._-]', '_')
  $filePath = Join-Path $baseDir "$safeName.json"
  $Payload | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $filePath -Encoding UTF8
  return $filePath
}

function Send-Inventory {
  param([Parameter(Mandatory=$true)]$Payload)

  $uri = ($ServerUrl.TrimEnd('/') + '/api/monitor-patrimonios/agente/inventario')
  $headers = @{
    'Content-Type' = 'application/json'
  }
  if ($Token) {
    $headers['X-Agent-Token'] = $Token
  }

  Invoke-RestMethod -Method Post -Uri $uri -Headers $headers -Body ($Payload | ConvertTo-Json -Depth 6)
}

function Invoke-InventoryCycle {
  $payload = Get-InventoryPayload
  $filePath = Save-LocalSnapshot -Payload $payload
  try {
    Send-Inventory -Payload $payload | Out-Null
    Write-Host "Inventario enviado com sucesso."
  } catch {
    Write-Warning "Inventario salvo localmente em $filePath, mas nao foi possivel enviar: $($_.Exception.Message)"
  }
}

function Start-InventoryLoop {
  $intervalSeconds = [Math]::Max(60, $IntervalMinutes * 60)
  while ($true) {
    Invoke-InventoryCycle
    Start-Sleep -Seconds $intervalSeconds
  }
}

function Get-PersistentAgentScriptPath {
  param([Parameter(Mandatory=$true)][string]$SourceScriptPath)

  $baseDir = Join-Path $env:ProgramData 'AppGPP\HostInventory'
  New-Item -ItemType Directory -Path $baseDir -Force | Out-Null
  $targetPath = Join-Path $baseDir 'HostInventoryAgent.ps1'

  $sourceResolved = (Resolve-Path -LiteralPath $SourceScriptPath).Path
  $targetResolved = if (Test-Path -LiteralPath $targetPath) {
    (Resolve-Path -LiteralPath $targetPath).Path
  } else {
    $null
  }

  if ($sourceResolved -ne $targetResolved) {
    Copy-Item -LiteralPath $SourceScriptPath -Destination $targetPath -Force
  }

  return $targetPath
}

function Get-CurrentScriptPath {
  if ($script:HostInventoryAgentScriptPath -and (Test-Path -LiteralPath $script:HostInventoryAgentScriptPath)) {
    return $script:HostInventoryAgentScriptPath
  }

  $candidates = @(
    $PSCommandPath,
    $MyInvocation.MyCommand.Path
  )

  foreach ($candidate in $candidates) {
    if ($candidate -and (Test-Path -LiteralPath $candidate)) {
      return $candidate
    }
  }

  $scriptDir = $PSScriptRoot
  if ($scriptDir) {
    $fallback = Join-Path $scriptDir 'HostInventoryAgent.ps1'
    if (Test-Path -LiteralPath $fallback) {
      return $fallback
    }
  }

  throw 'Nao foi possivel localizar o caminho do script do agente.'
}

function Get-NssmPath {
  $candidateNames = @('nssm.exe', 'nssm')
  foreach ($name in $candidateNames) {
    $cmd = Get-Command $name -ErrorAction SilentlyContinue
    if ($cmd -and $cmd.Source) {
      return $cmd.Source
    }
  }

  $scriptPath = Get-CurrentScriptPath
  $scriptDir = Split-Path -Parent $scriptPath
  foreach ($candidate in @(
    (Join-Path $scriptDir 'nssm.exe'),
    (Join-Path $scriptDir 'nssm\win64\nssm.exe'),
    (Join-Path $scriptDir 'nssm\win32\nssm.exe')
  )) {
    if (Test-Path $candidate) {
      return $candidate
    }
  }

  return $null
}

function Install-InventoryService {
  param([Parameter(Mandatory=$true)][string]$ScriptPath)

  $persistentScriptPath = Get-PersistentAgentScriptPath -SourceScriptPath $ScriptPath
  $nssmPath = Get-NssmPath
  if (-not $nssmPath) {
    Write-Host 'NSSM nao encontrado. Instalando como tarefa agendada para manter o agente em execucao.'
    Install-InventoryScheduledTask -ScriptPath $persistentScriptPath
    Write-Host 'INSTALL_MODE=TASK'
    return
  }

  $serviceArgs = @(
    'install', $ServiceName,
    'powershell.exe',
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-File', $persistentScriptPath,
    '-ServerUrl', $ServerUrl,
    '-Token', $Token,
    '-Hostname', $Hostname,
    '-ServiceMode',
    '-IntervalMinutes', $IntervalMinutes
  )

  & $nssmPath @serviceArgs | Out-Null
  & $nssmPath 'set' $ServiceName 'DisplayName' $ServiceDisplayName | Out-Null
  & $nssmPath 'set' $ServiceName 'Start' 'SERVICE_AUTO_START' | Out-Null
  & $nssmPath 'set' $ServiceName 'AppNoConsole' '1' | Out-Null
  & $nssmPath 'set' $ServiceName 'AppStdout' (Join-Path $env:ProgramData 'AppGPP\HostInventory\service.log') | Out-Null
  & $nssmPath 'set' $ServiceName 'AppStderr' (Join-Path $env:ProgramData 'AppGPP\HostInventory\service-error.log') | Out-Null
  & $nssmPath 'start' $ServiceName | Out-Null

  Write-Host "Servico instalado e iniciado: $ServiceName"
  Write-Host 'INSTALL_MODE=SERVICE'
}

function Install-InventoryScheduledTask {
  param([Parameter(Mandatory=$true)][string]$ScriptPath)

  $escapedScriptPath = Escape-DoubleQuotedArgument -Value $ScriptPath
  $escapedServerUrl = Escape-DoubleQuotedArgument -Value $ServerUrl
  $escapedToken = Escape-DoubleQuotedArgument -Value $Token
  $escapedHostname = Escape-DoubleQuotedArgument -Value $Hostname
  $taskArguments = '-NoProfile -ExecutionPolicy Bypass -File "' + $escapedScriptPath + '" -ServerUrl "' + $escapedServerUrl + '" -Token "' + $escapedToken + '" -Hostname "' + $escapedHostname + '" -ServiceMode -IntervalMinutes ' + $IntervalMinutes

  $action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $taskArguments
  $trigger = New-ScheduledTaskTrigger -AtStartup
  $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
  $principal = New-ScheduledTaskPrincipal -UserId 'SYSTEM' -LogonType ServiceAccount -RunLevel Highest

  Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force | Out-Null
  Write-Host "Tarefa agendada instalada: $TaskName"
  Write-Host 'INSTALL_MODE=TASK'
}

function Remove-InventoryService {
  $nssmPath = Get-NssmPath
  if ($nssmPath) {
    try { & $nssmPath 'stop' $ServiceName | Out-Null } catch {}
    & $nssmPath 'remove' $ServiceName 'confirm' | Out-Null
    Write-Host "Servico removido: $ServiceName"
    return
  }

  $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
  if ($service) {
    try { Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue } catch {}
    & sc.exe delete $ServiceName | Out-Null
    Write-Host "Servico removido via sc.exe: $ServiceName"
    return
  }

  Write-Host "Servico nao encontrado: $ServiceName"
}

function Escape-DoubleQuotedArgument {
  param([Parameter(Mandatory=$true)][string]$Value)

  return ($Value -replace '"', '\"')
}

if ($Install) {
  $scriptPath = Get-CurrentScriptPath
  Install-InventoryScheduledTask -ScriptPath (Get-PersistentAgentScriptPath -SourceScriptPath $scriptPath)

  if ($RunNow) {
    Invoke-InventoryCycle
  }

  return
}

if ($InstallService) {
  $scriptPath = Get-CurrentScriptPath
  Install-InventoryService -ScriptPath $scriptPath
  return
}

if ($UninstallService) {
  Remove-InventoryService
  return
}

if ($ServiceMode) {
  Start-InventoryLoop
  return
}

Invoke-InventoryCycle
