Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

[System.Windows.Forms.Application]::EnableVisualStyles()

function Step {
  param([string]$Message)
  Write-Host "[Update-AppGPP] $Message" -ForegroundColor Yellow
}

function Show-Message {
  param(
    [string]$Text,
    [string]$Title,
    [System.Windows.Forms.MessageBoxIcon]$Icon = [System.Windows.Forms.MessageBoxIcon]::Information
  )
  [System.Windows.Forms.MessageBox]::Show($Text, $Title, [System.Windows.Forms.MessageBoxButtons]::OK, $Icon) | Out-Null
}

function Add-Field {
  param(
    [System.Windows.Forms.Control]$Parent,
    [string]$Label,
    [string]$DefaultValue,
    [int]$Top = 0
  )

  $lbl = New-Object System.Windows.Forms.Label
  $lbl.Text = $Label
  $lbl.AutoSize = $true
  $lbl.Location = New-Object System.Drawing.Point(18, $Top)
  $Parent.Controls.Add($lbl)

  $tb = New-Object System.Windows.Forms.TextBox
  $tb.Location = New-Object System.Drawing.Point(18, ($Top + 20))
  $tb.Size = New-Object System.Drawing.Size(520, 24)
  $tb.Text = $DefaultValue
  $Parent.Controls.Add($tb)

  return $tb
}

function Invoke-UiRefresh {
  [System.Windows.Forms.Application]::DoEvents() | Out-Null
}

function Add-LogLine {
  param(
    [System.Windows.Forms.TextBox]$LogBox,
    [string]$Message
  )

  if (-not $LogBox) { return }

  $timestamp = Get-Date -Format "HH:mm:ss"
  $LogBox.AppendText("[$timestamp] $Message`r`n")
  $LogBox.SelectionStart = $LogBox.TextLength
  $LogBox.ScrollToCaret()
  Invoke-UiRefresh
}

function Set-ProgressState {
  param(
    [System.Windows.Forms.Label]$StatusLabel,
    [System.Windows.Forms.ProgressBar]$ProgressBar,
    [System.Windows.Forms.Label]$CurrentFileLabel,
    [string]$StatusText,
    [int]$Current = 0,
    [int]$Maximum = 0,
    [string]$CurrentFile = ""
  )

  if ($StatusLabel) {
    $StatusLabel.Text = $StatusText
  }

  if ($ProgressBar) {
    if ($Maximum -gt 0) {
      $ProgressBar.Style = [System.Windows.Forms.ProgressBarStyle]::Continuous
      $ProgressBar.Minimum = 0
      $ProgressBar.Maximum = $Maximum
      $ProgressBar.Value = [Math]::Min($Current, $Maximum)
    } else {
      $ProgressBar.Style = [System.Windows.Forms.ProgressBarStyle]::Marquee
    }
  }

  if ($CurrentFileLabel) {
    $CurrentFileLabel.Text = $CurrentFile
  }

  Invoke-UiRefresh
}

function Test-CriticalArtifacts {
  param([string]$InstallDir)

  $criticalPaths = @(
    (Join-Path $InstallDir "package.json"),
    (Join-Path $InstallDir ".next"),
    (Join-Path $InstallDir "node_modules"),
    (Join-Path $InstallDir "node_modules\.bin\prisma.cmd"),
    (Join-Path $InstallDir "scripts"),
    (Join-Path $InstallDir "prisma"),
    (Join-Path $InstallDir "public")
  )

  foreach ($path in $criticalPaths) {
    if (-not (Test-Path -LiteralPath $path)) {
      return $false
    }
  }

  return $true
}

function Invoke-OptionalScript {
  param(
    [string]$InstallDir,
    [string]$ScriptName
  )

  $scriptPath = Join-Path $InstallDir "scripts\$ScriptName"
  if (-not (Test-Path -LiteralPath $scriptPath)) {
    return
  }

  & powershell -NoProfile -ExecutionPolicy Bypass -File $scriptPath
  if ($LASTEXITCODE -ne 0) {
    throw "Falha ao executar $ScriptName com codigo $LASTEXITCODE"
  }
}

function Copy-SourceFiles {
  param(
    [string]$SourceDir,
    [string]$InstallDir,
    [System.Windows.Forms.TextBox]$LogBox,
    [System.Windows.Forms.Label]$StatusLabel,
    [System.Windows.Forms.ProgressBar]$ProgressBar,
    [System.Windows.Forms.Label]$CurrentFileLabel
  )

  $excludeDirs = @(".git", "dist", "installer", ".netlify", ".vscode", "_backups")
  $sourceRoot = (Resolve-Path -LiteralPath $SourceDir).Path.TrimEnd('\')
  $installRoot = (Resolve-Path -LiteralPath $InstallDir).Path.TrimEnd('\')
  $sourceLength = $sourceRoot.Length

  $files = Get-ChildItem -LiteralPath $sourceRoot -Recurse -File -Force | Where-Object {
    $relative = $_.FullName.Substring($sourceLength).TrimStart('\')
    if ([string]::IsNullOrWhiteSpace($relative)) { return $false }
    $firstSegment = ($relative -split '[\\/]', 2)[0]
    return -not ($excludeDirs -contains $firstSegment)
  }

  $total = @($files).Count
  if ($total -eq 0) {
    throw "Nenhum arquivo encontrado na pasta de origem: $sourceRoot"
  }

  Add-LogLine -LogBox $LogBox -Message "Iniciando transferencia de $total arquivo(s) para $installRoot"
  Set-ProgressState -StatusLabel $StatusLabel -ProgressBar $ProgressBar -CurrentFileLabel $CurrentFileLabel -StatusText "Preparando copia..." -Current 0 -Maximum $total -CurrentFile ""

  $current = 0
  foreach ($file in $files) {
    $relative = $file.FullName.Substring($sourceLength).TrimStart('\')
    $targetPath = Join-Path $installRoot $relative
    $targetDir = Split-Path -Parent $targetPath

    if (-not (Test-Path -LiteralPath $targetDir)) {
      New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    $current++
    Set-ProgressState -StatusLabel $StatusLabel -ProgressBar $ProgressBar -CurrentFileLabel $CurrentFileLabel -StatusText "Copiando arquivo $current de $total..." -Current $current -Maximum $total -CurrentFile $relative
    Add-LogLine -LogBox $LogBox -Message "Salvo: $relative"

    Copy-Item -LiteralPath $file.FullName -Destination $targetPath -Force
  }

  Add-LogLine -LogBox $LogBox -Message "Transferencia concluida. $total arquivo(s) copiados."

  if (-not (Test-CriticalArtifacts -InstallDir $InstallDir)) {
    throw "Falha ao atualizar arquivos. Alguns artefatos criticos nao foram encontrados apos a copia."
  }
}

function Apply-DatabaseMigrations {
  param([string]$InstallDir)

  Push-Location $InstallDir
  try {
    $prismaCmd = Join-Path $InstallDir "node_modules\.bin\prisma.cmd"
    if (-not (Test-Path -LiteralPath $prismaCmd)) {
      throw "Prisma nao encontrado na instalacao. O pacote precisa incluir node_modules."
    }

    & $prismaCmd migrate deploy
    if ($LASTEXITCODE -ne 0) {
      throw "Falha ao aplicar migrations do Prisma (codigo $LASTEXITCODE)."
    }
  } finally {
    Pop-Location
  }
}

function Invoke-Update {
  param(
    [ValidateSet("System", "Database", "Both")]
    [string]$Mode,
  [string]$SourceDir,
  [string]$InstallDir,
  [System.Windows.Forms.TextBox]$LogBox,
  [System.Windows.Forms.Label]$StatusLabel,
  [System.Windows.Forms.ProgressBar]$ProgressBar,
  [System.Windows.Forms.Label]$CurrentFileLabel,
  [System.Windows.Forms.Button[]]$Buttons
  )

  if (($Mode -eq 'System' -or $Mode -eq 'Both') -and [string]::IsNullOrWhiteSpace($SourceDir)) {
    Show-Message -Text "Informe a pasta da nova versao para os modos Sistema e Ambos." -Title "AppGPP" -Icon Warning
    return
  }

  if (-not (Test-Path -LiteralPath $InstallDir)) {
    Show-Message -Text "Pasta de instalacao nao encontrada." -Title "AppGPP" -Icon Error
    return
  }

  foreach ($btn in $Buttons) { $btn.Enabled = $false }
  $StatusLabel.Text = "Executando modo $Mode..."

  try {
    Step "Parando AppGPP"
    Invoke-OptionalScript -InstallDir $InstallDir -ScriptName "Stop-AppGPP-Server.ps1"

    if ($Mode -eq 'System' -or $Mode -eq 'Both') {
      Step "Criando backup da instalacao atual"
      $backupRoot = Join-Path $InstallDir "_backups"
      $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
      $backupDir = Join-Path $backupRoot $timestamp
      New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
      Add-LogLine -LogBox $LogBox -Message "Backup salvo em: $backupDir"
      & robocopy $InstallDir $backupDir /E /XJ /COPY:DAT /DCOPY:DAT /R:2 /W:1 /NFL /NDL /NJH /NJS /NP /XD "$InstallDir\node_modules" "$InstallDir\.next" "$InstallDir\_backups" | Out-Null
      if ($LASTEXITCODE -ge 8) {
        throw "Falha ao criar backup (robocopy $LASTEXITCODE)"
      }

      Step "Atualizando arquivos"
      Copy-SourceFiles -SourceDir $SourceDir -InstallDir $InstallDir -LogBox $LogBox -StatusLabel $StatusLabel -ProgressBar $ProgressBar -CurrentFileLabel $CurrentFileLabel
    }

    if ($Mode -eq 'Database' -or $Mode -eq 'Both') {
      Step "Aplicando migrations no MySQL"
      Apply-DatabaseMigrations -InstallDir $InstallDir
    }

    Step "Iniciando AppGPP"
    Invoke-OptionalScript -InstallDir $InstallDir -ScriptName "Start-AppGPP-Server.ps1"

    $StatusLabel.Text = "Atualizacao concluida com sucesso."
    Show-Message -Text "Atualizacao concluida com sucesso." -Title "AppGPP"
  } catch {
    $StatusLabel.Text = "Atualizacao falhou."
    $LogBox.AppendText("`r`n$($_.Exception.Message)")
    Show-Message -Text $_.Exception.Message -Title "AppGPP" -Icon Error
    if ($ProgressBar) {
      $ProgressBar.Style = [System.Windows.Forms.ProgressBarStyle]::Blocks
    }
  } finally {
    foreach ($btn in $Buttons) { $btn.Enabled = $true }
  }
}

$form = New-Object System.Windows.Forms.Form
$form.Text = "Atualizador AppGPP"
$form.StartPosition = "CenterScreen"
$form.ClientSize = New-Object System.Drawing.Size(860, 620)
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false
$form.MinimizeBox = $false

$title = New-Object System.Windows.Forms.Label
$title.Text = "Atualizacao do AppGPP"
$title.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$title.AutoSize = $true
$title.Location = New-Object System.Drawing.Point(18, 16)
$form.Controls.Add($title)

$subtitle = New-Object System.Windows.Forms.Label
$subtitle.Text = "Escolha o modo de atualizacao e informe a pasta da nova versao quando necessario."
$subtitle.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$subtitle.AutoSize = $true
$subtitle.Location = New-Object System.Drawing.Point(20, 48)
$form.Controls.Add($subtitle)

$defaultSourceDir = Get-Location
$txtSource = Add-Field -Parent $form -Label "Pasta da nova versao" -DefaultValue $defaultSourceDir.Path -Top 88
$btnSource = New-Object System.Windows.Forms.Button
$btnSource.Text = "..."
$btnSource.Location = New-Object System.Drawing.Point(550, 108)
$btnSource.Size = New-Object System.Drawing.Size(34, 24)
$btnSource.Add_Click({
  $dlg = New-Object System.Windows.Forms.FolderBrowserDialog
  $dlg.SelectedPath = $txtSource.Text
  if ($dlg.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
    $txtSource.Text = $dlg.SelectedPath
  }
})
$form.Controls.Add($btnSource)

$txtInstall = Add-Field -Parent $form -Label "Pasta de instalacao" -DefaultValue "C:\AppGPP" -Top 148
$btnInstall = New-Object System.Windows.Forms.Button
$btnInstall.Text = "..."
$btnInstall.Location = New-Object System.Drawing.Point(550, 168)
$btnInstall.Size = New-Object System.Drawing.Size(34, 24)
$btnInstall.Add_Click({
  $dlg = New-Object System.Windows.Forms.FolderBrowserDialog
  $dlg.SelectedPath = $txtInstall.Text
  if ($dlg.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
    $txtInstall.Text = $dlg.SelectedPath
  }
})
$form.Controls.Add($btnInstall)

$panelModes = New-Object System.Windows.Forms.GroupBox
$panelModes.Text = "Modo"
$panelModes.Location = New-Object System.Drawing.Point(18, 208)
$panelModes.Size = New-Object System.Drawing.Size(810, 92)
$form.Controls.Add($panelModes)

$btnSystem = New-Object System.Windows.Forms.Button
$btnSystem.Text = "Atualizar so sistema"
$btnSystem.Location = New-Object System.Drawing.Point(18, 32)
$btnSystem.Size = New-Object System.Drawing.Size(210, 34)

$btnDatabase = New-Object System.Windows.Forms.Button
$btnDatabase.Text = "Atualizar so banco"
$btnDatabase.Location = New-Object System.Drawing.Point(236, 32)
$btnDatabase.Size = New-Object System.Drawing.Size(210, 34)

$btnBoth = New-Object System.Windows.Forms.Button
$btnBoth.Text = "Atualizar ambos"
$btnBoth.Location = New-Object System.Drawing.Point(454, 32)
$btnBoth.Size = New-Object System.Drawing.Size(210, 34)

$panelModes.Controls.AddRange(@($btnSystem, $btnDatabase, $btnBoth))

$status = New-Object System.Windows.Forms.Label
$status.Text = "Aguardando acao."
$status.AutoSize = $true
$status.Location = New-Object System.Drawing.Point(20, 320)
$status.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$form.Controls.Add($status)

$currentFile = New-Object System.Windows.Forms.Label
$currentFile.Text = "Nenhum arquivo sendo transferido."
$currentFile.AutoSize = $true
$currentFile.MaximumSize = New-Object System.Drawing.Size(790, 0)
$currentFile.Location = New-Object System.Drawing.Point(20, 342)
$currentFile.Font = New-Object System.Drawing.Font("Segoe UI", 8)
$form.Controls.Add($currentFile)

$progress = New-Object System.Windows.Forms.ProgressBar
$progress.Location = New-Object System.Drawing.Point(18, 366)
$progress.Size = New-Object System.Drawing.Size(810, 18)
$progress.Style = [System.Windows.Forms.ProgressBarStyle]::Blocks
$form.Controls.Add($progress)

$log = New-Object System.Windows.Forms.TextBox
$log.Location = New-Object System.Drawing.Point(18, 392)
$log.Size = New-Object System.Drawing.Size(810, 176)
$log.Multiline = $true
$log.ScrollBars = "Vertical"
$log.ReadOnly = $true
$log.Font = New-Object System.Drawing.Font("Consolas", 9)
$form.Controls.Add($log)

$buttons = @($btnSystem, $btnDatabase, $btnBoth)
$btnSystem.Add_Click({ Invoke-Update -Mode "System" -SourceDir $txtSource.Text.Trim() -InstallDir $txtInstall.Text.Trim() -LogBox $log -StatusLabel $status -ProgressBar $progress -CurrentFileLabel $currentFile -Buttons $buttons })
$btnDatabase.Add_Click({ Invoke-Update -Mode "Database" -SourceDir $txtSource.Text.Trim() -InstallDir $txtInstall.Text.Trim() -LogBox $log -StatusLabel $status -ProgressBar $progress -CurrentFileLabel $currentFile -Buttons $buttons })
$btnBoth.Add_Click({ Invoke-Update -Mode "Both" -SourceDir $txtSource.Text.Trim() -InstallDir $txtInstall.Text.Trim() -LogBox $log -StatusLabel $status -ProgressBar $progress -CurrentFileLabel $currentFile -Buttons $buttons })

[void]$form.ShowDialog()
