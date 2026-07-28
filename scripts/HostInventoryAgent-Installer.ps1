param()

$ErrorActionPreference = 'Stop'

function Test-IsAdministrator {
  $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = [Security.Principal.WindowsPrincipal]::new($identity)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Get-SelfPath {
  if ($PSCommandPath) {
    return $PSCommandPath
  }

  if ($MyInvocation.MyCommand.Path) {
    return $MyInvocation.MyCommand.Path
  }

  try {
    $processPath = [System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName
    if ($processPath -and (Test-Path -LiteralPath $processPath)) {
      return $processPath
    }
  } catch {}

  throw 'Nao foi possivel localizar o caminho do instalador.'
}

function Test-HasNssm {
  $candidateNames = @('nssm.exe', 'nssm')
  foreach ($name in $candidateNames) {
    $cmd = Get-Command $name -ErrorAction SilentlyContinue
    if ($cmd -and $cmd.Source) {
      return $true
    }
  }

  return $false
}

function Ensure-Elevated {
  if (Test-IsAdministrator) {
    return
  }

  $selfPath = Get-SelfPath
  if ($selfPath.ToLower().EndsWith('.exe')) {
    Start-Process -FilePath $selfPath -Verb RunAs | Out-Null
  } else {
    $args = @(
      '-NoProfile'
      '-ExecutionPolicy', 'Bypass'
      '-File', "`"$selfPath`""
    )

    Start-Process -FilePath powershell.exe -Verb RunAs -ArgumentList $args | Out-Null
  }
  exit
}

Ensure-Elevated

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()

$form = New-Object System.Windows.Forms.Form
$form.Text = 'Instalador do Agente de Inventário'
$form.StartPosition = 'CenterScreen'
$form.Size = New-Object System.Drawing.Size(820, 560)
$form.MinimumSize = New-Object System.Drawing.Size(760, 520)
$form.BackColor = [System.Drawing.Color]::FromArgb(19, 28, 31)
$form.ForeColor = [System.Drawing.Color]::White
$form.Font = New-Object System.Drawing.Font('Segoe UI', 10)

$title = New-Object System.Windows.Forms.Label
$title.Text = 'Instalador do Agente de Inventário'
$title.Font = New-Object System.Drawing.Font('Segoe UI', 16, [System.Drawing.FontStyle]::Bold)
$title.AutoSize = $true
$title.Location = New-Object System.Drawing.Point(24, 20)
$title.ForeColor = [System.Drawing.Color]::White

$subtitle = New-Object System.Windows.Forms.Label
$subtitle.Text = 'Informe o host/IP e a porta do servidor para instalar o serviço no computador alvo.'
$subtitle.AutoSize = $true
$subtitle.MaximumSize = New-Object System.Drawing.Size(740, 0)
$subtitle.Location = New-Object System.Drawing.Point(24, 56)
$subtitle.ForeColor = [System.Drawing.Color]::FromArgb(181, 193, 197)

$groupConfig = New-Object System.Windows.Forms.GroupBox
$groupConfig.Text = 'Configuração do servidor'
$groupConfig.Location = New-Object System.Drawing.Point(24, 96)
$groupConfig.Size = New-Object System.Drawing.Size(760, 124)
$groupConfig.ForeColor = [System.Drawing.Color]::White
$groupConfig.BackColor = [System.Drawing.Color]::FromArgb(25, 39, 42)

$labelHost = New-Object System.Windows.Forms.Label
$labelHost.Text = 'Host/IP do servidor'
$labelHost.AutoSize = $true
$labelHost.Location = New-Object System.Drawing.Point(18, 34)

$txtHost = New-Object System.Windows.Forms.TextBox
$txtHost.Location = New-Object System.Drawing.Point(18, 58)
$txtHost.Size = New-Object System.Drawing.Size(500, 28)
$txtHost.BackColor = [System.Drawing.Color]::White
$txtHost.ForeColor = [System.Drawing.Color]::Black
$txtHost.Text = 'localhost'

$labelPort = New-Object System.Windows.Forms.Label
$labelPort.Text = 'Porta'
$labelPort.AutoSize = $true
$labelPort.Location = New-Object System.Drawing.Point(540, 34)

$txtPort = New-Object System.Windows.Forms.TextBox
$txtPort.Location = New-Object System.Drawing.Point(540, 58)
$txtPort.Size = New-Object System.Drawing.Size(180, 28)
$txtPort.BackColor = [System.Drawing.Color]::White
$txtPort.ForeColor = [System.Drawing.Color]::Black
$txtPort.Text = '3000'

$groupConfig.Controls.AddRange(@($labelHost, $txtHost, $labelPort, $txtPort))

$groupSteps = New-Object System.Windows.Forms.GroupBox
$groupSteps.Text = 'Processo de instalação'
$groupSteps.Location = New-Object System.Drawing.Point(24, 232)
$groupSteps.Size = New-Object System.Drawing.Size(760, 220)
$groupSteps.ForeColor = [System.Drawing.Color]::White
$groupSteps.BackColor = [System.Drawing.Color]::FromArgb(25, 39, 42)

$stepsList = New-Object System.Windows.Forms.ListBox
$stepsList.Location = New-Object System.Drawing.Point(18, 34)
$stepsList.Size = New-Object System.Drawing.Size(722, 160)
$stepsList.BackColor = [System.Drawing.Color]::FromArgb(15, 23, 25)
$stepsList.ForeColor = [System.Drawing.Color]::White
$stepsList.BorderStyle = 'FixedSingle'
@(
  '1. Informe o host/IP e a porta do servidor.',
  '2. Use "Testar conexão" para validar o acesso ao servidor.',
  '3. Clique em "Instalar".',
  '4. O instalador baixa o agente do servidor.',
  '5. O agente é registrado como serviço automático no host.',
  '6. O serviço inicia a coleta periódica e envia os dados para o servidor configurado.'
) | ForEach-Object { [void]$stepsList.Items.Add($_) }

$groupSteps.Controls.Add($stepsList)

$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Text = 'Pronto para instalar.'
$statusLabel.AutoSize = $true
$statusLabel.Location = New-Object System.Drawing.Point(24, 500)
$statusLabel.ForeColor = [System.Drawing.Color]::FromArgb(221, 231, 235)

$modePanel = New-Object System.Windows.Forms.Panel
$modePanel.Location = New-Object System.Drawing.Point(24, 454)
$modePanel.Size = New-Object System.Drawing.Size(760, 28)
$modePanel.BorderStyle = 'FixedSingle'
$modePanel.BackColor = if (Test-HasNssm) {
  [System.Drawing.Color]::FromArgb(16, 44, 35)
} else {
  [System.Drawing.Color]::FromArgb(57, 43, 12)
}

$modeBadge = New-Object System.Windows.Forms.Label
$modeBadge.AutoSize = $true
$modeBadge.Location = New-Object System.Drawing.Point(34, 5)
$modeBadge.ForeColor = [System.Drawing.Color]::FromArgb(248, 250, 252)
$modeBadge.Text = if (([string]$env:APPGPP_AGENT_DOWNLOAD_TOKEN).Trim() -or ([string]$env:HOST_INVENTORY_AGENT_DOWNLOAD_TOKEN).Trim()) {
  'Token'
} else {
  'Público'
}

$modeBadge.Text += if (Test-HasNssm) {
  ' | Serviço'
} else {
  ' | Startup'
}

$modeIcon = New-Object System.Windows.Forms.PictureBox
$modeIcon.Size = New-Object System.Drawing.Size(16, 16)
$modeIcon.Location = New-Object System.Drawing.Point(10, 6)
$modeIcon.SizeMode = 'StretchImage'
$modeIcon.Image = if (Test-HasNssm) {
  [System.Drawing.SystemIcons]::Shield.ToBitmap()
} else {
  [System.Drawing.SystemIcons]::Information.ToBitmap()
}

$modePanel.Controls.Add($modeIcon)
$modePanel.Controls.Add($modeBadge)

$btnInstall = New-Object System.Windows.Forms.Button
$btnInstall.Text = 'Instalar'
$btnInstall.Size = New-Object System.Drawing.Size(140, 40)
$btnInstall.Location = New-Object System.Drawing.Point(624, 508)
$btnInstall.BackColor = [System.Drawing.Color]::FromArgb(37, 99, 235)
$btnInstall.ForeColor = [System.Drawing.Color]::White
$btnInstall.FlatStyle = 'Flat'

$btnCancel = New-Object System.Windows.Forms.Button
$btnCancel.Text = 'Cancelar'
$btnCancel.Size = New-Object System.Drawing.Size(140, 40)
$btnCancel.Location = New-Object System.Drawing.Point(470, 508)
$btnCancel.BackColor = [System.Drawing.Color]::FromArgb(30, 41, 59)
$btnCancel.ForeColor = [System.Drawing.Color]::White
$btnCancel.FlatStyle = 'Flat'

$logRoot = Join-Path $env:ProgramData 'AppGPP\HostInventory'
New-Item -ItemType Directory -Path $logRoot -Force | Out-Null
$logPath = Join-Path $logRoot 'installer.log'

function Write-InstallLog {
  param([Parameter(Mandatory=$true)][string]$Message)

  $line = "[{0}] {1}" -f (Get-Date).ToString('yyyy-MM-dd HH:mm:ss'), $Message
  Add-Content -LiteralPath $logPath -Value $line -Encoding UTF8
}

function Get-ServerUrl {
  param(
    [string]$HostName,
    [string]$Port
  )

  $hostValue = ([string]$HostName).Trim()
  $portValue = ([string]$Port).Trim()
  if (-not $hostValue -or -not $portValue) {
    throw 'Informe o host/IP e a porta do servidor.'
  }

  $scheme = if ($portValue -eq '443') { 'https' } else { 'http' }
  return ($scheme + '://' + $hostValue + ':' + $portValue)
}

function Test-ServerConnection {
  param(
    [string]$HostName,
    [string]$Port
  )

  $hostValue = ([string]$HostName).Trim()
  $portValue = ([int]([string]$Port).Trim())
  if (-not $hostValue -or -not $portValue) {
    throw 'Informe o host/IP e a porta do servidor.'
  }

  $client = [System.Net.Sockets.TcpClient]::new()
  try {
    $async = $client.BeginConnect($hostValue, $portValue, $null, $null)
    if (-not $async.AsyncWaitHandle.WaitOne(5000, $false)) {
      throw 'Tempo esgotado ao tentar conectar ao servidor.'
    }

    $client.EndConnect($async)
    return $true
  } finally {
    $client.Close()
  }
}

function Install-HostAgent {
  param(
    [string]$ServerUrl
  )

  $tempDir = Join-Path $env:TEMP 'AppGPP-HostInventoryAgent'
  New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
  $agentScriptPath = Join-Path $tempDir 'HostInventoryAgent.ps1'
  $persistentDir = Join-Path $env:ProgramData 'AppGPP\HostInventory'
  New-Item -ItemType Directory -Path $persistentDir -Force | Out-Null
  $persistentScriptPath = Join-Path $persistentDir 'HostInventoryAgent.ps1'

  $downloadToken = ([string]$env:APPGPP_AGENT_DOWNLOAD_TOKEN).Trim()
  if (-not $downloadToken) {
    $downloadToken = ([string]$env:HOST_INVENTORY_AGENT_DOWNLOAD_TOKEN).Trim()
  }

  if ($downloadToken) {
    $downloadUrl = $ServerUrl.TrimEnd('/') + '/api/monitor-patrimonios/agente/token/script?serverUrl=' + [uri]::EscapeDataString($ServerUrl) + '&downloadToken=' + [uri]::EscapeDataString($downloadToken)
    Write-InstallLog "Baixando agente em modo token de $downloadUrl"
  } else {
    $downloadUrl = $ServerUrl.TrimEnd('/') + '/api/monitor-patrimonios/agente/public/script?serverUrl=' + [uri]::EscapeDataString($ServerUrl)
    Write-InstallLog "Baixando agente em modo público de $downloadUrl"
  }

  Invoke-WebRequest -Uri $downloadUrl -OutFile $agentScriptPath
  Copy-Item -LiteralPath $agentScriptPath -Destination $persistentScriptPath -Force

  $stdoutPath = Join-Path $tempDir 'install-stdout.txt'
  $stderrPath = Join-Path $tempDir 'install-stderr.txt'
  Remove-Item -LiteralPath $stdoutPath, $stderrPath -Force -ErrorAction SilentlyContinue

  $process = Start-Process -FilePath powershell.exe -ArgumentList @(
    '-NoProfile'
    '-ExecutionPolicy', 'Bypass'
    '-File', $persistentScriptPath
    '-InstallService'
  ) -WindowStyle Hidden -Wait -PassThru -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath

  if ($process.ExitCode -ne 0) {
    $stderr = if (Test-Path -LiteralPath $stderrPath) { Get-Content -LiteralPath $stderrPath -Raw } else { '' }
    $stdout = if (Test-Path -LiteralPath $stdoutPath) { Get-Content -LiteralPath $stdoutPath -Raw } else { '' }
    $detail = ($stderr + "`n" + $stdout).Trim()
    if ($detail) {
      throw "O instalador retornou o código $($process.ExitCode). $detail"
    }
    throw "O instalador retornou o código $($process.ExitCode)."
  }

  $stdout = if (Test-Path -LiteralPath $stdoutPath) { Get-Content -LiteralPath $stdoutPath -Raw } else { '' }
  $installMode = if ($stdout -match 'INSTALL_MODE=TASK') { 'TASK' } elseif ($stdout -match 'INSTALL_MODE=SERVICE') { 'SERVICE' } else { 'UNKNOWN' }

  if ($installMode -eq 'TASK') {
    Write-InstallLog "Agente instalado como tarefa agendada para $ServerUrl"
  } elseif ($installMode -eq 'SERVICE') {
    Write-InstallLog "Agente instalado como servico para $ServerUrl"
  } else {
    Write-InstallLog "Agente instalado para $ServerUrl"
  }

  return $installMode
}

$btnTest = New-Object System.Windows.Forms.Button
$btnTest.Text = 'Testar conexão'
$btnTest.Size = New-Object System.Drawing.Size(140, 40)
$btnTest.Location = New-Object System.Drawing.Point(316, 508)
$btnTest.BackColor = [System.Drawing.Color]::FromArgb(30, 41, 59)
$btnTest.ForeColor = [System.Drawing.Color]::White
$btnTest.FlatStyle = 'Flat'

function Update-ValidationState {
  $hostOk = -not [string]::IsNullOrWhiteSpace($txtHost.Text)
  $portText = ([string]$txtPort.Text).Trim()
  $portOk = $portText -match '^\d+$' -and [int]$portText -ge 1 -and [int]$portText -le 65535

  $txtHost.BackColor = if ($hostOk) { [System.Drawing.Color]::White } else { [System.Drawing.Color]::MistyRose }
  $txtPort.BackColor = if ($portOk) { [System.Drawing.Color]::White } else { [System.Drawing.Color]::MistyRose }

  $btnInstall.Enabled = $hostOk -and $portOk
  $btnTest.Enabled = $hostOk -and $portOk

  return $hostOk -and $portOk
}

$txtHost.Add_TextChanged({ [void](Update-ValidationState) })
$txtPort.Add_TextChanged({ [void](Update-ValidationState) })

$btnInstall.Add_Click({
  try {
    if (-not (Update-ValidationState)) {
      $statusLabel.Text = 'Corrija o host/IP e a porta antes de instalar.'
      return
    }
    $btnInstall.Enabled = $false
    $statusLabel.Text = 'Validando servidor...'
    $serverUrl = Get-ServerUrl -HostName $txtHost.Text -Port $txtPort.Text
    $statusLabel.Text = "Baixando agente de $serverUrl ..."
    Write-InstallLog "Iniciando instalação para $serverUrl"
    $installMode = Install-HostAgent -ServerUrl $serverUrl
    if ($installMode -eq 'TASK') {
      $statusLabel.Text = 'Agente ativo como tarefa agendada.'
    } elseif ($installMode -eq 'SERVICE') {
      $statusLabel.Text = 'Serviço instalado com sucesso.'
    } else {
      $statusLabel.Text = 'Instalação concluída.'
    }
    $messageText = if ($installMode -eq 'TASK') {
      'O agente foi instalado como tarefa agendada e ficará ativo ao iniciar o Windows.'
    } elseif ($installMode -eq 'SERVICE') {
      'O agente foi instalado como serviço e começará a enviar os dados periodicamente.'
    } else {
      'O agente foi instalado e começará a enviar os dados periodicamente.'
    }
    [System.Windows.Forms.MessageBox]::Show(
      $messageText,
      'Instalação concluída',
      [System.Windows.Forms.MessageBoxButtons]::OK,
      [System.Windows.Forms.MessageBoxIcon]::Information
    ) | Out-Null
  } catch {
    $statusLabel.Text = 'Falha na instalação.'
    [System.Windows.Forms.MessageBox]::Show(
      $_.Exception.Message,
      'Erro na instalação',
      [System.Windows.Forms.MessageBoxButtons]::OK,
      [System.Windows.Forms.MessageBoxIcon]::Error
    ) | Out-Null
  } finally {
    $btnInstall.Enabled = $true
  }
})

$btnTest.Add_Click({
  try {
    if (-not (Update-ValidationState)) {
      $statusLabel.Text = 'Corrija o host/IP e a porta antes de testar.'
      return
    }
    $statusLabel.Text = 'Testando conexão...'
    $ok = Test-ServerConnection -HostName $txtHost.Text -Port $txtPort.Text
    if ($ok) {
      $statusLabel.Text = 'Conexão com o servidor OK.'
      Write-InstallLog "Teste de conexão OK para $($txtHost.Text):$($txtPort.Text)"
      [System.Windows.Forms.MessageBox]::Show(
        'Conexão validada com sucesso.',
        'Teste de conexão',
        [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]::Information
      ) | Out-Null
    }
  } catch {
    $statusLabel.Text = 'Falha no teste de conexão.'
    Write-InstallLog "Teste de conexão falhou para $($txtHost.Text):$($txtPort.Text) - $($_.Exception.Message)"
    [System.Windows.Forms.MessageBox]::Show(
      $_.Exception.Message,
      'Teste de conexão',
      [System.Windows.Forms.MessageBoxButtons]::OK,
      [System.Windows.Forms.MessageBoxIcon]::Error
    ) | Out-Null
  }
})

$btnCancel.Add_Click({
  $form.Close()
})

$form.Controls.AddRange(@($title, $subtitle, $groupConfig, $groupSteps, $modePanel, $statusLabel, $btnTest, $btnInstall, $btnCancel))
$form.Add_Shown({ $form.Activate() })
[void](Update-ValidationState)
[void]$form.ShowDialog()


