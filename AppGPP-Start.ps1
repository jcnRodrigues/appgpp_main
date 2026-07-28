param(
  [switch]$Foreground,
  [switch]$Dev
)

$ErrorActionPreference = "Stop"

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
      if (-not (Test-Path -LiteralPath $parent)) {
        continue
      }
      $resolved = $parent
    }

    $item = Get-Item -LiteralPath $resolved -ErrorAction SilentlyContinue
    if (-not $item) {
      continue
    }

    $basePath = if ($item.PSIsContainer) { $item.FullName } else { Split-Path -Parent $item.FullName }
    if ([string]::IsNullOrWhiteSpace($basePath)) {
      continue
    }

    if ((Test-Path -LiteralPath (Join-Path $basePath "package.json")) -and
      (Test-Path -LiteralPath (Join-Path $basePath "scripts\Start-AppGPP-Server.ps1"))) {
      return (Get-Item -LiteralPath $basePath).FullName
    }
  }

  return ""
}

function Write-LauncherError {
  param(
    [string]$Message
  )

  try {
    $programData = $env:ProgramData
    if ([string]::IsNullOrWhiteSpace($programData)) {
      $programData = "C:\ProgramData"
    }

    $logDir = Join-Path $programData "AppGPP"
    $logPath = Join-Path $logDir "launcher-error.log"
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    $stamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Add-Content -LiteralPath $logPath -Value "[$stamp] $Message"
  } catch {
    # Ignora falha secundaria ao tentar registrar o erro.
  }
}

function Write-LauncherStatus {
  param(
    [string]$Message
  )

  try {
    Write-Host "[AppGPP] $Message"
  } catch {
    # Ignora falha se a saida de console nao estiver disponivel.
  }
}

function Select-LaunchMode {
  try {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing

    $form = New-Object System.Windows.Forms.Form
    $form.Text = "AppGPP - Selecione o modo de inicializacao"
    $form.StartPosition = "CenterScreen"
    $form.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::FixedDialog
    $form.MaximizeBox = $false
    $form.MinimizeBox = $false
    $form.ClientSize = New-Object System.Drawing.Size(440, 220)
    $form.TopMost = $true
    $form.BackColor = [System.Drawing.Color]::FromArgb(245, 247, 250)
    $form.Font = New-Object System.Drawing.Font("Segoe UI", 10)

    $title = New-Object System.Windows.Forms.Label
    $title.Text = "Como o AppGPP deve iniciar?"
    $title.AutoSize = $true
    $title.Location = New-Object System.Drawing.Point(18, 16)
    $title.Font = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)

    $description = New-Object System.Windows.Forms.Label
    $description.Text = "Escolha o modo antes de abrir o servidor."
    $description.AutoSize = $true
    $description.Location = New-Object System.Drawing.Point(18, 48)

    $devRadio = New-Object System.Windows.Forms.RadioButton
    $devRadio.Text = "Modo Dev"
    $devRadio.AutoSize = $true
    $devRadio.Location = New-Object System.Drawing.Point(24, 86)

    $devHint = New-Object System.Windows.Forms.Label
    $devHint.Text = "Usa configuracoes de desenvolvimento e abre no localhost."
    $devHint.AutoSize = $true
    $devHint.Location = New-Object System.Drawing.Point(48, 111)
    $devHint.ForeColor = [System.Drawing.Color]::DimGray

    $prodRadio = New-Object System.Windows.Forms.RadioButton
    $prodRadio.Text = "Modo Prod"
    $prodRadio.AutoSize = $true
    $prodRadio.Location = New-Object System.Drawing.Point(24, 142)
    $prodRadio.Checked = $true

    $prodHint = New-Object System.Windows.Forms.Label
    $prodHint.Text = "Inicia o servidor para uso normal do aplicativo."
    $prodHint.AutoSize = $true
    $prodHint.Location = New-Object System.Drawing.Point(48, 167)
    $prodHint.ForeColor = [System.Drawing.Color]::DimGray

    $statusLabel = New-Object System.Windows.Forms.Label
    $statusLabel.Text = "Selecione um modo para continuar."
    $statusLabel.AutoSize = $true
    $statusLabel.Location = New-Object System.Drawing.Point(18, 195)
    $statusLabel.ForeColor = [System.Drawing.Color]::DimGray

    $okButton = New-Object System.Windows.Forms.Button
    $okButton.Text = "Iniciar"
    $okButton.Width = 100
    $okButton.Height = 32
    $okButton.Location = New-Object System.Drawing.Point(220, 178)
    $okButton.DialogResult = [System.Windows.Forms.DialogResult]::OK

    $cancelButton = New-Object System.Windows.Forms.Button
    $cancelButton.Text = "Cancelar"
    $cancelButton.Width = 100
    $cancelButton.Height = 32
    $cancelButton.Location = New-Object System.Drawing.Point(328, 178)
    $cancelButton.DialogResult = [System.Windows.Forms.DialogResult]::Cancel

    $updateStatus = {
      if ($devRadio.Checked) {
        $statusLabel.Text = "O AppGPP iniciara em modo Dev."
      } else {
        $statusLabel.Text = "O AppGPP iniciara em modo Prod."
      }
    }

    $devRadio.add_CheckedChanged($updateStatus)
    $prodRadio.add_CheckedChanged($updateStatus)
    & $updateStatus

    $form.AcceptButton = $okButton
    $form.CancelButton = $cancelButton
    $form.Controls.AddRange(@($title, $description, $devRadio, $devHint, $prodRadio, $prodHint, $statusLabel, $okButton, $cancelButton))

    $result = $form.ShowDialog()
    if ($result -ne [System.Windows.Forms.DialogResult]::OK) {
      return $null
    }

    if ($devRadio.Checked) {
      return "Dev"
    }

    return "Prod"
  } catch {
    return $null
  }
}

$trayScriptPath = $null
$appRoot = Resolve-AppRoot
if ([string]::IsNullOrWhiteSpace($appRoot)) {
  throw "Nao foi possivel identificar a pasta raiz do AppGPP."
}

$scriptCandidates = @(
  (Join-Path $appRoot "scripts\Start-AppGPP-Server.ps1"),
  (Join-Path $appRoot "powershell-scripts\Start-AppGPP-Server.ps1")
)
$trayCandidates = @(
  (Join-Path $appRoot "scripts\AppGPP-Tray.ps1"),
  (Join-Path $appRoot "powershell-scripts\AppGPP-Tray.ps1")
)
$startScript = $scriptCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
$trayScriptPath = $trayCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
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

if (-not $Dev) {
  $selectedMode = Select-LaunchMode
  if ($null -eq $selectedMode) {
    Write-LauncherError -Message "Inicializacao cancelada pelo usuario na tela de selecao de modo."
    exit 0
  }

  if ($selectedMode -eq "Dev") {
    $Dev = $true
    $publicHost = "localhost"
  }

  Write-LauncherStatus -Message "Modo selecionado: $selectedMode"
  Write-LauncherStatus -Message "Executando em modo $selectedMode..."
}

if ([string]::IsNullOrWhiteSpace($startScript)) {
  throw "Nao foi possivel localizar o script de inicio em: $($scriptCandidates -join ', ')"
}

try {
  if (-not $Foreground -and $trayScriptPath) {
    $trayArgs = @(
      "-NoProfile",
      "-ExecutionPolicy", "Bypass",
      "-File", $trayScriptPath
    )
    if ($Dev) {
      $trayArgs += "-Dev"
    }

    Start-Process -FilePath "powershell.exe" -ArgumentList $trayArgs -WindowStyle Hidden | Out-Null
  } else {
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
      Start-Process -FilePath "powershell.exe" -ArgumentList $startArgs -NoNewWindow -Wait
    } else {
      Start-Process -FilePath "powershell.exe" -ArgumentList $startArgs -WindowStyle Hidden | Out-Null
    }

    Start-Sleep -Seconds 2
    Start-Process "http://$publicHost`:$port"
  }
} catch {
  $errorMessage = $_.Exception.Message
  Write-LauncherError -Message $errorMessage
  try {
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.MessageBox]::Show(
      "Nao foi possivel iniciar o AppGPP.`n`n$errorMessage",
      "AppGPP",
      [System.Windows.Forms.MessageBoxButtons]::OK,
      [System.Windows.Forms.MessageBoxIcon]::Error
    ) | Out-Null
  } catch {
    # Sem interface disponivel.
  }
  throw
}
