$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

[System.Windows.Forms.Application]::EnableVisualStyles()

function Escape-ArgValue {
  param([string]$Value)
  return '"' + ($Value -replace '"', '""') + '"'
}

function Test-MySqlInstalled {
  if (Get-Command mysql -ErrorAction SilentlyContinue) { return $true }
  $svc = Get-Service -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "MySQL*" -or $_.DisplayName -like "MySQL*" } | Select-Object -First 1
  return ($null -ne $svc)
}

function Open-MySqlDownloadPage {
  $url = "https://dev.mysql.com/downloads/installer/"
  try {
    Start-Process $url | Out-Null
  } catch {}
}

function Show-CompanyForm {
  param(
    [string]$InstallDir,
    [System.Drawing.Icon]$AppIcon
  )

  function Save-CompanyInDatabase {
    param(
      [string]$BaseDir,
      [hashtable]$Company
    )

    $nodeScript = @"
const path = require('path');
process.chdir(path.resolve(process.argv[2]));
const company = JSON.parse(process.argv[3]);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const existing = await prisma.tbEmpresa.findFirst({ orderBy: { idEmp: 'asc' } });
  if (existing) {
    await prisma.tbEmpresa.update({
      where: { idEmp: existing.idEmp },
      data: {
        razaoEmpresa: company.razao_social || null,
        fantasiaEmpresa: company.nome_fantasia || null,
        cnpjEmpresa: company.cnpj || null
      }
    });
  } else {
    await prisma.tbEmpresa.create({
      data: {
        razaoEmpresa: company.razao_social || null,
        fantasiaEmpresa: company.nome_fantasia || null,
        cnpjEmpresa: company.cnpj || null
      }
    });
  }
}

run()
  .then(async () => { await prisma.`$disconnect(); process.exit(0); })
  .catch(async (e) => {
    console.error(e && e.message ? e.message : String(e));
    await prisma.`$disconnect();
    process.exit(1);
  });
"@

    $scriptPath = Join-Path $env:TEMP ("appgpp-save-company-" + [guid]::NewGuid().ToString("N") + ".js")
    $errPath = Join-Path $env:TEMP ("appgpp-save-company-" + [guid]::NewGuid().ToString("N") + ".err.log")
    Set-Content -LiteralPath $scriptPath -Value $nodeScript -Encoding UTF8

    try {
      $companyJson = ($Company | ConvertTo-Json -Compress -Depth 4)
      $proc = Start-Process -FilePath "node" -ArgumentList @($scriptPath, $BaseDir, $companyJson) -RedirectStandardError $errPath -Wait -PassThru
      if ($proc.ExitCode -ne 0) {
        $details = ""
        if (Test-Path -LiteralPath $errPath) { $details = (Get-Content -LiteralPath $errPath -Raw) }
        return @{ ok = $false; details = $details }
      }
      return @{ ok = $true; details = "" }
    } finally {
      Remove-Item -LiteralPath $scriptPath -Force -ErrorAction SilentlyContinue
      Remove-Item -LiteralPath $errPath -Force -ErrorAction SilentlyContinue
    }
  }

  $form = New-Object System.Windows.Forms.Form
  $form.Text = "Cadastro da Empresa"
  $form.StartPosition = "CenterScreen"
  $form.ClientSize = New-Object System.Drawing.Size(560, 420)
  $form.FormBorderStyle = "FixedDialog"
  $form.MaximizeBox = $false
  $form.MinimizeBox = $false
  $form.ControlBox = $false
  if ($AppIcon) { $form.Icon = $AppIcon }

  function Add-Field {
    param([string]$Label, [int]$Y)
    $lbl = New-Object System.Windows.Forms.Label
    $lbl.Text = $Label
    $lbl.Location = New-Object System.Drawing.Point(20, $Y)
    $lbl.AutoSize = $true
    $form.Controls.Add($lbl)

    $tb = New-Object System.Windows.Forms.TextBox
    $tb.Location = New-Object System.Drawing.Point(20, ($Y + 18))
    $tb.Size = New-Object System.Drawing.Size(520, 24)
    $form.Controls.Add($tb)
    return $tb
  }

  $tbRazao = Add-Field -Label "Razao social" -Y 20
  $tbFantasia = Add-Field -Label "Nome fantasia" -Y 74
  $tbCnpj = Add-Field -Label "CNPJ" -Y 128
  $script:isFormattingCnpj = $false
  $tbCnpj.Add_TextChanged({
    if ($script:isFormattingCnpj) { return }
    $script:isFormattingCnpj = $true
    try {
      $digits = ($tbCnpj.Text -replace '\D', '')
      if ($digits.Length -gt 14) { $digits = $digits.Substring(0, 14) }

      $formatted = $digits
      if ($digits.Length -gt 2) { $formatted = $digits.Substring(0,2) + "." + $digits.Substring(2) }
      if ($digits.Length -gt 5) { $formatted = $formatted.Substring(0,6) + "." + $formatted.Substring(6) }
      if ($digits.Length -gt 8) { $formatted = $formatted.Substring(0,10) + "/" + $formatted.Substring(10) }
      if ($digits.Length -gt 12) { $formatted = $formatted.Substring(0,15) + "-" + $formatted.Substring(15) }

      $tbCnpj.Text = $formatted
      $tbCnpj.SelectionStart = $tbCnpj.Text.Length
    } finally {
      $script:isFormattingCnpj = $false
    }
  })
  $tbEmail = Add-Field -Label "E-mail" -Y 182
  $tbTelefone = Add-Field -Label "Telefone" -Y 236
  $tbEndereco = Add-Field -Label "Endereco" -Y 290

  $btnSave = New-Object System.Windows.Forms.Button
  $btnSave.Text = "Salvar"
  $btnSave.Location = New-Object System.Drawing.Point(440, 350)
  $btnSave.Size = New-Object System.Drawing.Size(100, 32)
  $btnSave.BackColor = [System.Drawing.Color]::FromArgb(18, 70, 112)
  $btnSave.ForeColor = [System.Drawing.Color]::White
  $btnSave.FlatStyle = "Flat"
  $btnSave.Add_Click({
    if ([string]::IsNullOrWhiteSpace($tbRazao.Text.Trim())) {
      [System.Windows.Forms.MessageBox]::Show("Preencha ao menos a razao social.", "Cadastro da Empresa") | Out-Null
      return
    }

    $empresa = [ordered]@{
      razao_social = $tbRazao.Text.Trim()
      nome_fantasia = $tbFantasia.Text.Trim()
      cnpj = $tbCnpj.Text.Trim()
      email = $tbEmail.Text.Trim()
      telefone = $tbTelefone.Text.Trim()
      endereco = $tbEndereco.Text.Trim()
      atualizado_em = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    }

    $dbResult = Save-CompanyInDatabase -BaseDir $InstallDir -Company $empresa
    if ($dbResult.ok) {
      [System.Windows.Forms.MessageBox]::Show("Cadastro salvo no banco de dados MySQL (tbEmpresa).", "Cadastro da Empresa") | Out-Null
      $form.Tag = "saved"
      $form.Close()
    } else {
      [System.Windows.Forms.MessageBox]::Show("Nao foi possivel gravar no MySQL. Corrija a conexao e tente salvar novamente.`n`nDetalhes: $($dbResult.details)", "Cadastro da Empresa") | Out-Null
    }
  })
  $form.Controls.Add($btnSave)

  $form.AcceptButton = $btnSave

  [void]$form.ShowDialog()
}

$scriptPath = $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($scriptPath)) { $scriptPath = $PSCommandPath }
if ([string]::IsNullOrWhiteSpace($scriptPath)) { $scriptPath = [System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName }
$baseDir = if ([string]::IsNullOrWhiteSpace($scriptPath)) { [System.AppDomain]::CurrentDomain.BaseDirectory } else { Split-Path -Parent $scriptPath }

$payloadPath = Join-Path $baseDir "AppGPP-Payload.zip"
$iconPath = Join-Path $baseDir "AppGPP.ico"
$appIcon = $null
if (Test-Path -LiteralPath $iconPath) {
  try { $appIcon = New-Object System.Drawing.Icon($iconPath) } catch {}
}

$form = New-Object System.Windows.Forms.Form
$form.Text = "AppGPP Installer"
$form.StartPosition = "CenterScreen"
$form.ClientSize = New-Object System.Drawing.Size(620, 700)
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false
$form.MinimizeBox = $false
$form.BackColor = [System.Drawing.Color]::FromArgb(245, 248, 251)
if ($appIcon) { $form.Icon = $appIcon }

$title = New-Object System.Windows.Forms.Label
$title.Text = "Instalacao do AppGPP"
$title.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$title.ForeColor = [System.Drawing.Color]::FromArgb(18, 70, 112)
$title.AutoSize = $true
$title.Location = New-Object System.Drawing.Point(20, 16)
$form.Controls.Add($title)

$subtitle = New-Object System.Windows.Forms.Label
$subtitle.Text = "Preencha os dados do servidor e banco MySQL"
$subtitle.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$subtitle.ForeColor = [System.Drawing.Color]::FromArgb(70, 70, 70)
$subtitle.AutoSize = $true
$subtitle.Location = New-Object System.Drawing.Point(22, 50)
$form.Controls.Add($subtitle)

function Add-Input {
  param([string]$Label,[int]$Y,[string]$Default = "",[switch]$Password)
  $lbl = New-Object System.Windows.Forms.Label
  $lbl.Text = $Label
  $lbl.Location = New-Object System.Drawing.Point(22, $Y)
  $lbl.AutoSize = $true
  $lbl.Font = New-Object System.Drawing.Font("Segoe UI", 9)
  $form.Controls.Add($lbl)

  $tb = New-Object System.Windows.Forms.TextBox
  $tb.Location = New-Object System.Drawing.Point(22, ($Y + 20))
  $tb.Size = New-Object System.Drawing.Size(576, 24)
  $tb.Text = $Default
  $tb.Font = New-Object System.Drawing.Font("Segoe UI", 10)
  if ($Password) { $tb.UseSystemPasswordChar = $true }
  $form.Controls.Add($tb)
  return $tb
}

$tbInstallDir = Add-Input -Label "Pasta de instalacao" -Y 88 -Default "C:\\AppGPP"
$btnBrowse = New-Object System.Windows.Forms.Button
$btnBrowse.Text = "..."
$btnBrowse.Location = New-Object System.Drawing.Point(566, 107)
$btnBrowse.Size = New-Object System.Drawing.Size(32, 24)
$btnBrowse.Add_Click({
  $dlg = New-Object System.Windows.Forms.FolderBrowserDialog
  $dlg.SelectedPath = $tbInstallDir.Text
  if ($dlg.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { $tbInstallDir.Text = $dlg.SelectedPath }
})
$form.Controls.Add($btnBrowse)

$tbServerHost = Add-Input -Label "Host/IP do servidor AppGPP" -Y 148 -Default "localhost"
$tbServerPort = Add-Input -Label "Porta do AppGPP" -Y 208 -Default "3000"
$tbDbHost = Add-Input -Label "Host/IP do MySQL" -Y 268 -Default "localhost"
$tbDbPort = Add-Input -Label "Porta do MySQL" -Y 328 -Default "3306"
$tbDbUser = Add-Input -Label "Usuario MySQL" -Y 388 -Default "root"
$tbDbPassword = Add-Input -Label "Senha MySQL" -Y 448 -Default "" -Password
$tbDbName = Add-Input -Label "Banco MySQL" -Y 508 -Default "appgpp"

$footer = New-Object System.Windows.Forms.Panel
$footer.Location = New-Object System.Drawing.Point(0, 645)
$footer.Size = New-Object System.Drawing.Size(620, 55)
$footer.BackColor = [System.Drawing.Color]::FromArgb(234, 238, 243)
$form.Controls.Add($footer)

$status = New-Object System.Windows.Forms.Label
$status.Text = ""
$status.Location = New-Object System.Drawing.Point(22, 18)
$status.Size = New-Object System.Drawing.Size(300, 20)
$status.ForeColor = [System.Drawing.Color]::FromArgb(190, 62, 40)
$footer.Controls.Add($status)

$btnCancel = New-Object System.Windows.Forms.Button
$btnCancel.Text = "Cancelar"
$btnCancel.Location = New-Object System.Drawing.Point(356, 12)
$btnCancel.Size = New-Object System.Drawing.Size(110, 30)
$btnCancel.Add_Click({ $form.Close() })
$footer.Controls.Add($btnCancel)

$btnInstall = New-Object System.Windows.Forms.Button
$btnInstall.Text = "Instalar"
$btnInstall.Location = New-Object System.Drawing.Point(482, 12)
$btnInstall.Size = New-Object System.Drawing.Size(110, 30)
$btnInstall.BackColor = [System.Drawing.Color]::FromArgb(18, 70, 112)
$btnInstall.ForeColor = [System.Drawing.Color]::White
$btnInstall.FlatStyle = "Flat"
$footer.Controls.Add($btnInstall)
$form.AcceptButton = $btnInstall
$form.CancelButton = $btnCancel

function Set-FormError {
  param(
    [string]$Message,
    [System.Windows.Forms.Control]$FocusControl
  )
  $status.ForeColor = [System.Drawing.Color]::FromArgb(190, 62, 40)
  $status.Text = $Message
  if ($FocusControl) {
    $FocusControl.Focus() | Out-Null
    if ($FocusControl -is [System.Windows.Forms.TextBox]) {
      $FocusControl.SelectAll()
    }
  }
}

function Get-FriendlyErrorMessage {
  param([string]$RawError)
  $raw = ($RawError | Out-String).Trim()

  if ($raw -match "N.{0,2}o .*converter o valor .* para o tipo .*Int32|Int32|cadeia de caracteres de entrada") {
    return "Valor numerico invalido. Verifique as portas do AppGPP e do MySQL (somente numeros, ex.: 3000 e 3306)."
  }
  if ($raw -match "Porta do AppGPP invalida") { return "Porta do AppGPP invalida. Use um numero entre 1 e 65535." }
  if ($raw -match "Porta do MySQL invalida") { return "Porta do MySQL invalida. Use um numero entre 1 e 65535." }
  if ($raw -match "Preencha todos os campos obrigatorios") { return "Existem campos obrigatorios em branco. Revise os dados e tente novamente." }
  if ($raw -match "Payload|Install-AppGPP.ps1 nao encontrado") { return "Arquivos do instalador incompletos. Mantenha o EXE e o Payload na mesma pasta." }
  if ($raw -match "EBADENGINE|Node\.js compativel: 20, 21 ou 22|engine") { return "Versao do Node.js incompativel. Instale Node.js 20, 21 ou 22 e execute novamente." }
  if ($raw -match "mysql|MySQL") { return "Falha relacionada ao MySQL. Revise host, porta, usuario, senha e se o MySQL esta instalado." }

  return "Falha na instalacao. Revise os dados informados e tente novamente."
}

function Show-ErrorDialog {
  param(
    [string]$RawError,
    [System.Drawing.Icon]$AppIcon,
    [string]$LogPath = ""
  )

  $friendly = Get-FriendlyErrorMessage -RawError $RawError

  $errForm = New-Object System.Windows.Forms.Form
  $errForm.Text = "Erro na Instalacao"
  $errForm.StartPosition = "CenterScreen"
  $errForm.ClientSize = New-Object System.Drawing.Size(760, 360)
  $errForm.FormBorderStyle = "FixedDialog"
  $errForm.MaximizeBox = $false
  $errForm.MinimizeBox = $false
  $errForm.TopMost = $true
  if ($AppIcon) { $errForm.Icon = $AppIcon }

  $lblTitle = New-Object System.Windows.Forms.Label
  $lblTitle.Text = "Nao foi possivel concluir a instalacao"
  $lblTitle.Location = New-Object System.Drawing.Point(18, 14)
  $lblTitle.AutoSize = $true
  $lblTitle.Font = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
  $lblTitle.ForeColor = [System.Drawing.Color]::FromArgb(170, 40, 30)
  $errForm.Controls.Add($lblTitle)

  $lblFriendly = New-Object System.Windows.Forms.Label
  $lblFriendly.Text = $friendly
  $lblFriendly.Location = New-Object System.Drawing.Point(20, 48)
  $lblFriendly.Size = New-Object System.Drawing.Size(720, 44)
  $lblFriendly.Font = New-Object System.Drawing.Font("Segoe UI", 10)
  $errForm.Controls.Add($lblFriendly)

  $lblTech = New-Object System.Windows.Forms.Label
  $lblTech.Text = "Detalhes tecnicos:"
  $lblTech.Location = New-Object System.Drawing.Point(20, 98)
  $lblTech.AutoSize = $true
  $lblTech.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
  $errForm.Controls.Add($lblTech)

  $tbDetails = New-Object System.Windows.Forms.TextBox
  $tbDetails.Location = New-Object System.Drawing.Point(20, 118)
  $tbDetails.Size = New-Object System.Drawing.Size(720, 190)
  $tbDetails.Multiline = $true
  $tbDetails.ScrollBars = "Vertical"
  $tbDetails.ReadOnly = $true
  $tbDetails.Font = New-Object System.Drawing.Font("Consolas", 9)
  $tbDetails.Text = ($RawError | Out-String).Trim()
  $errForm.Controls.Add($tbDetails)

  if (-not [string]::IsNullOrWhiteSpace($LogPath)) {
    $lblLog = New-Object System.Windows.Forms.Label
    $lblLog.Text = "Log salvo em: $LogPath"
    $lblLog.Location = New-Object System.Drawing.Point(20, 314)
    $lblLog.Size = New-Object System.Drawing.Size(560, 34)
    $errForm.Controls.Add($lblLog)
  }

  $btnOk = New-Object System.Windows.Forms.Button
  $btnOk.Text = "Voltar e corrigir"
  $btnOk.Location = New-Object System.Drawing.Point(600, 320)
  $btnOk.Size = New-Object System.Drawing.Size(140, 30)
  $btnOk.Add_Click({ $errForm.Close() })
  $errForm.Controls.Add($btnOk)
  $errForm.AcceptButton = $btnOk

  [void]$errForm.ShowDialog()
}

function Resolve-ErrorFocus {
  param([string]$Text)
  $t = ($Text | Out-String)
  if ($t -match "Porta do AppGPP|ServerPort") { return $tbServerPort }
  if ($t -match "Porta do MySQL|DbPort|DATABASE_URL|mysql") { return $tbDbPort }
  if ($t -match "DbHost|host/IP do MySQL") { return $tbDbHost }
  if ($t -match "DbUser|usuario") { return $tbDbUser }
  if ($t -match "DbName|banco") { return $tbDbName }
  if ($t -match "InstallDir|Pasta de instalacao|acesso ao caminho") { return $tbInstallDir }
  if ($t -match "EBADENGINE|Node\.js|engine") { return $null }
  return $null
}

$btnInstall.Add_Click({
  try {
    $status.Text = ""
    if (-not (Test-Path $payloadPath)) { throw "Arquivo AppGPP-Payload.zip nao encontrado ao lado do instalador." }

    $installDir = $tbInstallDir.Text.Trim()
    $serverHost = $tbServerHost.Text.Trim()
    $dbHost = $tbDbHost.Text.Trim()
    $dbUser = $tbDbUser.Text.Trim()
    $dbPassword = $tbDbPassword.Text
    $dbName = $tbDbName.Text.Trim()

    $serverPort = 0
    $dbPort = 0
    if (-not [int]::TryParse($tbServerPort.Text.Trim(), [ref]$serverPort) -or $serverPort -lt 1 -or $serverPort -gt 65535) { Set-FormError -Message "Porta do AppGPP invalida." -FocusControl $tbServerPort; return }
    if (-not [int]::TryParse($tbDbPort.Text.Trim(), [ref]$dbPort) -or $dbPort -lt 1 -or $dbPort -gt 65535) { Set-FormError -Message "Porta do MySQL invalida." -FocusControl $tbDbPort; return }
    if ([string]::IsNullOrWhiteSpace($installDir) -or [string]::IsNullOrWhiteSpace($serverHost) -or [string]::IsNullOrWhiteSpace($dbHost) -or [string]::IsNullOrWhiteSpace($dbUser) -or [string]::IsNullOrWhiteSpace($dbName)) {
      Set-FormError -Message "Preencha todos os campos obrigatorios." -FocusControl $tbInstallDir
      return
    }

    if (-not (Test-MySqlInstalled)) {
      $choice = [System.Windows.Forms.MessageBox]::Show(
        "MySQL nao foi detectado nesta maquina. Deseja tentar instalar automaticamente agora?",
        "MySQL nao encontrado",
        [System.Windows.Forms.MessageBoxButtons]::YesNoCancel,
        [System.Windows.Forms.MessageBoxIcon]::Warning
      )

      if ($choice -eq [System.Windows.Forms.DialogResult]::Cancel) { return }

      if ($choice -eq [System.Windows.Forms.DialogResult]::Yes) {
        if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
          Open-MySqlDownloadPage
          [System.Windows.Forms.MessageBox]::Show("Winget nao encontrado. O site oficial do MySQL foi aberto para download. Instale o MySQL e execute novamente.", "MySQL") | Out-Null
          return
        }

        $status.ForeColor = [System.Drawing.Color]::FromArgb(25, 110, 40)
        $status.Text = "Instalando MySQL..."
        $form.Refresh()

        $mysqlProc = Start-Process -FilePath "winget" -ArgumentList "install --id Oracle.MySQL --exact --accept-source-agreements --accept-package-agreements" -Wait -PassThru
        if ($mysqlProc.ExitCode -ne 0) {
          Open-MySqlDownloadPage
          [System.Windows.Forms.MessageBox]::Show("Nao foi possivel instalar MySQL automaticamente. O site oficial foi aberto para instalacao manual.", "MySQL") | Out-Null
          return
        }

        Start-Sleep -Seconds 2
        if (-not (Test-MySqlInstalled)) {
          Open-MySqlDownloadPage
          [System.Windows.Forms.MessageBox]::Show("MySQL ainda nao foi detectado. O site oficial foi aberto para instalacao manual.", "MySQL") | Out-Null
          return
        }
      } else {
        Open-MySqlDownloadPage
        [System.Windows.Forms.MessageBox]::Show("Instale o MySQL e execute o instalador novamente. O site oficial foi aberto.", "MySQL") | Out-Null
        return
      }
    }

    $btnInstall.Enabled = $false
    $btnCancel.Enabled = $false
    $form.Hide()

    $progressForm = New-Object System.Windows.Forms.Form
    $progressForm.Text = "Instalando AppGPP"
    $progressForm.StartPosition = "CenterScreen"
    $progressForm.ClientSize = New-Object System.Drawing.Size(680, 430)
    $progressForm.FormBorderStyle = "FixedDialog"
    $progressForm.MaximizeBox = $false
    $progressForm.MinimizeBox = $false
    if ($appIcon) { $progressForm.Icon = $appIcon }

    $lbl = New-Object System.Windows.Forms.Label
    $lbl.Text = "Processo de instalacao em andamento"
    $lbl.Location = New-Object System.Drawing.Point(16, 14)
    $lbl.AutoSize = $true
    $lbl.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
    $progressForm.Controls.Add($lbl)

    $bar = New-Object System.Windows.Forms.ProgressBar
    $bar.Location = New-Object System.Drawing.Point(16, 44)
    $bar.Size = New-Object System.Drawing.Size(648, 22)
    $bar.Style = "Marquee"
    $progressForm.Controls.Add($bar)

    $log = New-Object System.Windows.Forms.TextBox
    $log.Location = New-Object System.Drawing.Point(16, 78)
    $log.Size = New-Object System.Drawing.Size(648, 300)
    $log.Multiline = $true
    $log.ScrollBars = "Vertical"
    $log.ReadOnly = $true
    $log.Font = New-Object System.Drawing.Font("Consolas", 9)
    $progressForm.Controls.Add($log)

    $btnCloseProgress = New-Object System.Windows.Forms.Button
    $btnCloseProgress.Text = "Fechar"
    $btnCloseProgress.Location = New-Object System.Drawing.Point(564, 388)
    $btnCloseProgress.Size = New-Object System.Drawing.Size(100, 30)
    $btnCloseProgress.Enabled = $false
    $btnCloseProgress.Add_Click({ $progressForm.Close() })
    $progressForm.Controls.Add($btnCloseProgress)

    $tempDir = Join-Path $env:TEMP ("AppGPP_Install_" + [guid]::NewGuid().ToString("N"))
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    Expand-Archive -LiteralPath $payloadPath -DestinationPath $tempDir -Force

    $installerScript = Join-Path $tempDir "Install-AppGPP.ps1"
    if (-not (Test-Path $installerScript)) { throw "Install-AppGPP.ps1 nao encontrado no payload." }

    $argParts = @(
      "-NoProfile",
      "-ExecutionPolicy Bypass",
      "-File " + (Escape-ArgValue $installerScript),
      "-InstallDir " + (Escape-ArgValue $installDir),
      "-ServerHost " + (Escape-ArgValue $serverHost),
      "-ServerPort $serverPort",
      "-DbHost " + (Escape-ArgValue $dbHost),
      "-DbPort $dbPort",
      "-DbUser " + (Escape-ArgValue $dbUser),
      "-DbPassword " + (Escape-ArgValue $dbPassword),
      "-DbName " + (Escape-ArgValue $dbName)
    )

    $stdoutLog = Join-Path $tempDir "install-stdout.log"
    $stderrLog = Join-Path $tempDir "install-stderr.log"
    $combinedLog = Join-Path $tempDir "install-combined.log"
    if (Test-Path $stdoutLog) { Remove-Item -LiteralPath $stdoutLog -Force -ErrorAction SilentlyContinue }
    if (Test-Path $stderrLog) { Remove-Item -LiteralPath $stderrLog -Force -ErrorAction SilentlyContinue }
    if (Test-Path $combinedLog) { Remove-Item -LiteralPath $combinedLog -Force -ErrorAction SilentlyContinue }

    $proc = Start-Process -FilePath "powershell.exe" -ArgumentList ($argParts -join " ") -RedirectStandardOutput $stdoutLog -RedirectStandardError $stderrLog -PassThru
    $progressForm.Show()

    while (-not $proc.HasExited) {
      if (Test-Path $stdoutLog) { $log.Text = (Get-Content -LiteralPath $stdoutLog -Raw) }
      if (Test-Path $stderrLog) {
        $errRaw = Get-Content -LiteralPath $stderrLog -Raw
        if (-not [string]::IsNullOrWhiteSpace($errRaw)) {
          $log.Text = $log.Text + [Environment]::NewLine + "[ERRO]" + [Environment]::NewLine + $errRaw
        }
      }
      [System.Windows.Forms.Application]::DoEvents()
      Start-Sleep -Milliseconds 250
    }

    $outFinal = ""
    $errFinal = ""
    if (Test-Path $stdoutLog) { $outFinal = Get-Content -LiteralPath $stdoutLog -Raw }
    if (Test-Path $stderrLog) { $errFinal = Get-Content -LiteralPath $stderrLog -Raw }
    $log.Text = $outFinal
    if (-not [string]::IsNullOrWhiteSpace($errFinal)) {
      $log.Text = $log.Text + [Environment]::NewLine + "[ERRO]" + [Environment]::NewLine + $errFinal
    }

    try {
      $proc.WaitForExit()
      $proc.Refresh()
      $exitCode = $proc.ExitCode
    } catch {
      $exitCode = -1
    }
    if ($null -eq $exitCode) { $exitCode = -1 }

    $successMarker = ($outFinal -match "\[AppGPP\] Instalacao concluida")
    if ($exitCode -eq -1 -and $successMarker) {
      $exitCode = 0
    }
    $combinedText = @(
      "=== AppGPP Installer Log ===",
      "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
      "ExitCode: $exitCode",
      "",
      "----- STDOUT -----",
      $outFinal,
      "",
      "----- STDERR -----",
      $errFinal
    ) -join [Environment]::NewLine
    Set-Content -LiteralPath $combinedLog -Value $combinedText -Encoding UTF8

    $persistLogPath = ""
    try {
      $logTargetDir = if (-not [string]::IsNullOrWhiteSpace($installDir) -and (Test-Path -LiteralPath $installDir)) { $installDir } else { $env:TEMP }
      $persistLogPath = Join-Path $logTargetDir "appgpp-install.log"
      Copy-Item -LiteralPath $combinedLog -Destination $persistLogPath -Force
    } catch {
      $persistLogPath = $combinedLog
    }

    if ($exitCode -ne 0) {
      $log.AppendText("Instalacao finalizada com erro (codigo $exitCode)." + [Environment]::NewLine)
      $errorLine = ($log.Lines | Where-Object { $_ -and $_.Trim() -ne "" -and $_ -notmatch "Environment variables loaded from \.env" } | Select-Object -Last 1)
      if (-not $errorLine) { $errorLine = "Falha na instalacao (codigo $exitCode). Consulte os detalhes tecnicos." }
      $progressForm.Close()
      $btnInstall.Enabled = $true
      $btnCancel.Enabled = $true
      $form.Show()
      Set-FormError -Message (Get-FriendlyErrorMessage -RawError $errorLine) -FocusControl (Resolve-ErrorFocus -Text $errorLine)
      Show-ErrorDialog -RawError ($combinedText + [Environment]::NewLine + [Environment]::NewLine + "Resumo: " + $errorLine) -AppIcon $appIcon -LogPath $persistLogPath
      return
    }

    $bar.Style = "Blocks"
    $bar.Value = 100
    $log.AppendText("Instalacao concluida com sucesso." + [Environment]::NewLine)
    $btnCloseProgress.Enabled = $true

    [System.Windows.Forms.MessageBox]::Show("Instalacao concluida. Vamos cadastrar a empresa.", "AppGPP Installer", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information) | Out-Null
    $progressForm.Close()

    Show-CompanyForm -InstallDir $installDir -AppIcon $appIcon

    [System.Windows.Forms.MessageBox]::Show("Processo finalizado. Use o atalho AppGPP para iniciar.", "AppGPP Installer") | Out-Null
    $form.Close()
  } catch {
    $rawErr = $_.Exception.Message
    Set-FormError -Message (Get-FriendlyErrorMessage -RawError $rawErr) -FocusControl (Resolve-ErrorFocus -Text $rawErr)
    $btnInstall.Enabled = $true
    $btnCancel.Enabled = $true
    $form.Show()
    Show-ErrorDialog -RawError $rawErr -AppIcon $appIcon
  }
})

[void]$form.ShowDialog()
