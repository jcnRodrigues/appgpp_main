param(
  [ValidateSet("System", "Database", "Both")]
  [string]$Mode = "Both",
  [string]$SourceDir,
  [string]$InstallDir = "C:\\AppGPP",
  [switch]$AutoRun
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

[System.Windows.Forms.Application]::EnableVisualStyles()

function Step {
  param([string]$Message)
  Write-Host "[Update-AppGPP] $Message" -ForegroundColor Yellow
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

function Add-Field {
  param(
    [System.Windows.Forms.Control]$Parent,
    [string]$Label,
    [string]$DefaultValue,
    [int]$Top = 0,
    [switch]$ReadOnly
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
  $tb.ReadOnly = [bool]$ReadOnly
  $Parent.Controls.Add($tb)

  return $tb
}

function Invoke-OptionalScript {
  param(
    [string]$ScriptName,
    [string[]]$Arguments = @()
  )

  $scriptPath = Join-Path $InstallDir "scripts\$ScriptName"
  if (-not (Test-Path -LiteralPath $scriptPath)) {
    return
  }

  & powershell -NoProfile -ExecutionPolicy Bypass -File $scriptPath @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Falha ao executar $ScriptName com codigo $LASTEXITCODE"
  }
}

function Require-Path {
  param(
    [string]$Path,
    [string]$Message
  )

  if ([string]::IsNullOrWhiteSpace($Path)) {
    throw $Message
  }

  if (-not (Test-Path -LiteralPath $Path)) {
    throw $Message
  }
}

function Get-AppPackageVersion {
  param([string]$RootDir)

  if ([string]::IsNullOrWhiteSpace($RootDir)) {
    return $null
  }

  $packagePath = Join-Path $RootDir "package.json"
  if (-not (Test-Path -LiteralPath $packagePath)) {
    return $null
  }

  try {
    $packageJson = Get-Content -LiteralPath $packagePath -Raw | ConvertFrom-Json
    $version = [string]$packageJson.version
    if (-not [string]::IsNullOrWhiteSpace($version)) {
      return $version.Trim()
    }
  } catch {
    return $null
  }

  return $null
}

function Normalize-VersionTag {
  param([string]$Value)

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return "sem-versao"
  }

  return ($Value.Trim() -replace '[^0-9A-Za-z\.\-_]+', '-')
}

function Write-UpdateManifest {
  param(
    [string]$InstallDir,
    [hashtable]$Record
  )

  if ([string]::IsNullOrWhiteSpace($InstallDir) -or -not (Test-Path -LiteralPath $InstallDir)) {
    return
  }

  $historyPath = Join-Path $InstallDir "update-history.json"
  $history = @()

  if (Test-Path -LiteralPath $historyPath) {
    try {
      $rawHistory = Get-Content -LiteralPath $historyPath -Raw
      if (-not [string]::IsNullOrWhiteSpace($rawHistory)) {
        $parsedHistory = $rawHistory | ConvertFrom-Json
        if ($parsedHistory -is [System.Array]) {
          $history = @($parsedHistory)
        } elseif ($parsedHistory) {
          $history = @($parsedHistory)
        }
      }
    } catch {
      $history = @()
    }
  }

  $history += [pscustomobject]$Record

  if ($history.Count -gt 50) {
    $history = @($history | Select-Object -Last 50)
  }

  $history | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $historyPath -Encoding UTF8
}

function Backup-CurrentInstall {
  param(
    [string]$InstallDir,
    [string]$BackupDir,
    [hashtable]$Metadata
  )

  New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
  & robocopy $InstallDir $BackupDir /E /R:2 /W:1 /NFL /NDL /NJH /NJS /NP /XD "$InstallDir\node_modules" "$InstallDir\.next" "$InstallDir\_backups" | Out-Null
  if ($LASTEXITCODE -ge 8) {
    throw "Falha ao criar backup (robocopy $LASTEXITCODE)"
  }

  if ($Metadata) {
    $metadataPath = Join-Path $BackupDir "update-info.json"
    $Metadata | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $metadataPath -Encoding UTF8
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

  if (-not (Test-CriticalUpdateArtifacts -InstallDir $InstallDir)) {
    throw "Atualizacao de arquivos concluida, mas artefatos criticos nao foram encontrados."
  }
}

function Test-CriticalUpdateArtifacts {
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

$runFiles = $Mode -ne "Database"
$runDatabase = $Mode -ne "System"

Require-Path -Path $InstallDir -Message "InstallDir nao encontrado: $InstallDir"
if ($runFiles) {
  Require-Path -Path $SourceDir -Message "Informe -SourceDir com a pasta da nova versao do AppGPP."
}

if ($runFiles) {
  Require-Path -Path $SourceDir -Message "SourceDir nao encontrado: $SourceDir"
}

function Invoke-Update {
  param(
    [System.Windows.Forms.TextBox]$LogBox,
    [System.Windows.Forms.Label]$StatusLabel,
    [System.Windows.Forms.ProgressBar]$ProgressBar,
    [System.Windows.Forms.Label]$CurrentFileLabel
  )

  $backupDir = $null
  $sourceVersion = if ($runFiles) { Get-AppPackageVersion -RootDir $SourceDir } else { Get-AppPackageVersion -RootDir $InstallDir }
  $installVersionBefore = Get-AppPackageVersion -RootDir $InstallDir
  $updateVersion = if ($sourceVersion) { $sourceVersion } elseif ($installVersionBefore) { $installVersionBefore } else { "0.0.0" }
  $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $versionTag = Normalize-VersionTag -Value "$updateVersion-$timestamp"
  try {
    Step "Parando AppGPP"
    Add-LogLine -LogBox $LogBox -Message "Parando AppGPP"
    Invoke-OptionalScript -ScriptName "Stop-AppGPP-Server.ps1" -Arguments @("-InstallDir", $InstallDir)

    if ($runFiles) {
      $backupRoot = Join-Path $InstallDir "_backups"
      $backupDir = Join-Path $backupRoot "$timestamp-$Mode-$versionTag"
      $metadata = @{
        mode = $Mode
        updateVersion = $updateVersion
        versionTag = $versionTag
        sourceVersion = $sourceVersion
        installVersionBefore = $installVersionBefore
        sourceDir = $SourceDir
        installDir = $InstallDir
        createdAt = (Get-Date).ToString("o")
      }

      Step "Criando backup da instalacao atual"
      Add-LogLine -LogBox $LogBox -Message "Backup salvo em: $backupDir"
      Set-ProgressState -StatusLabel $StatusLabel -ProgressBar $ProgressBar -CurrentFileLabel $CurrentFileLabel -StatusText "Criando backup..." -Current 0 -Maximum 0 -CurrentFile ""
      Backup-CurrentInstall -InstallDir $InstallDir -BackupDir $backupDir -Metadata $metadata

      Step "Atualizando arquivos"
      Copy-SourceFiles -SourceDir $SourceDir -InstallDir $InstallDir -LogBox $LogBox -StatusLabel $StatusLabel -ProgressBar $ProgressBar -CurrentFileLabel $CurrentFileLabel
    } else {
      Add-LogLine -LogBox $LogBox -Message "Modo banco: nenhuma copia de arquivos sera aplicada"
    }

    if ($runDatabase) {
      Step "Aplicando migrations no MySQL"
      Add-LogLine -LogBox $LogBox -Message "Aplicando migrations no MySQL"
      Set-ProgressState -StatusLabel $StatusLabel -ProgressBar $ProgressBar -CurrentFileLabel $CurrentFileLabel -StatusText "Aplicando migrations..." -Current 0 -Maximum 0 -CurrentFile ""
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

    Step "Iniciando AppGPP"
    Add-LogLine -LogBox $LogBox -Message "Iniciando AppGPP"
    Invoke-OptionalScript -ScriptName "Start-AppGPP-Server.ps1"

    $installVersionAfter = Get-AppPackageVersion -RootDir $InstallDir
    Write-UpdateManifest -InstallDir $InstallDir -Record @{
      mode = $Mode
      updateVersion = $updateVersion
      versionTag = $versionTag
      sourceVersion = $sourceVersion
      installVersionBefore = $installVersionBefore
      installVersionAfter = $installVersionAfter
      sourceDir = $SourceDir
      installDir = $InstallDir
      backupDir = $backupDir
      createdAt = (Get-Date).ToString("o")
      success = $true
    }

    Step "Atualizacao concluida com sucesso"
    Add-LogLine -LogBox $LogBox -Message "Atualizacao concluida com sucesso"
    Add-LogLine -LogBox $LogBox -Message "Versao da atualizacao: $versionTag"
    if ($backupDir) {
      Add-LogLine -LogBox $LogBox -Message "Backup criado em: $backupDir"
    }
    if ($StatusLabel) {
      $StatusLabel.Text = "Atualizacao concluida com sucesso."
    }
    if ($ProgressBar) {
      $ProgressBar.Style = [System.Windows.Forms.ProgressBarStyle]::Blocks
      $ProgressBar.Value = $ProgressBar.Maximum
    }
  } catch {
    if ($StatusLabel) {
      $StatusLabel.Text = "Atualizacao falhou."
    }
    if ($LogBox) {
      Add-LogLine -LogBox $LogBox -Message $_.Exception.Message
    }
    Write-UpdateManifest -InstallDir $InstallDir -Record @{
      mode = $Mode
      updateVersion = $updateVersion
      versionTag = $versionTag
      sourceVersion = $sourceVersion
      installVersionBefore = $installVersionBefore
      sourceDir = $SourceDir
      installDir = $InstallDir
      backupDir = $backupDir
      createdAt = (Get-Date).ToString("o")
      success = $false
      error = $_.Exception.Message
    }
    throw
  }
}

function Show-UpdateWindow {
  param(
    [System.Windows.Forms.Form]$Form,
    [System.Windows.Forms.TextBox]$LogBox,
    [System.Windows.Forms.Label]$StatusLabel,
    [System.Windows.Forms.ProgressBar]$ProgressBar,
    [System.Windows.Forms.Label]$CurrentFileLabel
  )

  $runButton = New-Object System.Windows.Forms.Button
  $runButton.Text = "Fechar"
  $runButton.Enabled = $false
  $runButton.Location = New-Object System.Drawing.Point(18, 580)
  $runButton.Size = New-Object System.Drawing.Size(110, 28)
  $runButton.Add_Click({ $Form.Close() })
  $Form.Controls.Add($runButton)

  $Form.Add_Shown({
    try {
      $runButton.Enabled = $false
      Invoke-Update -LogBox $LogBox -StatusLabel $StatusLabel -ProgressBar $ProgressBar -CurrentFileLabel $CurrentFileLabel
      $runButton.Enabled = $true
      $runButton.Text = "Fechar"
    } catch {
      $runButton.Enabled = $true
      $runButton.Text = "Fechar"
      [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, "AppGPP", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error) | Out-Null
    }
  })

  [void]$Form.ShowDialog()
}

if ($AutoRun.IsPresent) {
  $form = New-Object System.Windows.Forms.Form
  $form.Text = "Atualizador AppGPP - $Mode"
  $form.StartPosition = "CenterScreen"
  $form.ClientSize = New-Object System.Drawing.Size(860, 632)
  $form.FormBorderStyle = "FixedDialog"
  $form.MaximizeBox = $false
  $form.MinimizeBox = $false

  $title = New-Object System.Windows.Forms.Label
  $title.Text = "Atualizacao do AppGPP ($Mode)"
  $title.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
  $title.AutoSize = $true
  $title.Location = New-Object System.Drawing.Point(18, 16)
  $form.Controls.Add($title)

  $subtitle = New-Object System.Windows.Forms.Label
  $subtitle.Text = "Acompanhe a transferencia dos arquivos e o nome de cada item salvo."
  $subtitle.Font = New-Object System.Drawing.Font("Segoe UI", 10)
  $subtitle.AutoSize = $true
  $subtitle.Location = New-Object System.Drawing.Point(20, 48)
  $form.Controls.Add($subtitle)

  $rowTop = 88
  $defaultSourcePath = $SourceDir
  if ([string]::IsNullOrWhiteSpace($defaultSourcePath)) {
    $defaultSourcePath = (Get-Location).Path
  }
  if ($runFiles) {
    $txtSource = Add-Field -Parent $form -Label "Pasta da nova versao" -DefaultValue $defaultSourcePath -Top $rowTop
    $txtSource.ReadOnly = $true
    $rowTop += 60
  }

  $txtInstall = Add-Field -Parent $form -Label "Pasta de instalacao" -DefaultValue $InstallDir -Top $rowTop
  $txtInstall.ReadOnly = $true
  $rowTop += 60

  $status = New-Object System.Windows.Forms.Label
  $status.Text = "Aguardando inicio."
  $status.AutoSize = $true
  $status.Location = New-Object System.Drawing.Point(20, $rowTop)
  $status.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
  $form.Controls.Add($status)
  $rowTop += 22

  $currentFile = New-Object System.Windows.Forms.Label
  $currentFile.Text = "Nenhum arquivo sendo transferido."
  $currentFile.AutoSize = $true
  $currentFile.MaximumSize = New-Object System.Drawing.Size(800, 0)
  $currentFile.Location = New-Object System.Drawing.Point(20, $rowTop)
  $currentFile.Font = New-Object System.Drawing.Font("Segoe UI", 8)
  $form.Controls.Add($currentFile)
  $rowTop += 24

  $progress = New-Object System.Windows.Forms.ProgressBar
  $progress.Location = New-Object System.Drawing.Point(18, $rowTop)
  $progress.Size = New-Object System.Drawing.Size(810, 18)
  $progress.Style = [System.Windows.Forms.ProgressBarStyle]::Blocks
  $form.Controls.Add($progress)
  $rowTop += 28

  $log = New-Object System.Windows.Forms.TextBox
  $log.Location = New-Object System.Drawing.Point(18, $rowTop)
  $log.Size = New-Object System.Drawing.Size(810, 200)
  $log.Multiline = $true
  $log.ScrollBars = "Vertical"
  $log.ReadOnly = $true
  $log.Font = New-Object System.Drawing.Font("Consolas", 9)
  $form.Controls.Add($log)

  Show-UpdateWindow -Form $form -LogBox $log -StatusLabel $status -ProgressBar $progress -CurrentFileLabel $currentFile
} else {
  Invoke-Update -LogBox $null -StatusLabel $null -ProgressBar $null -CurrentFileLabel $null
}
