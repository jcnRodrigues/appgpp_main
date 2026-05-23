param(
  [string]$OutputExe = "dist\\AppGPP-Installer.exe"
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host "[Build-Installer] $Message" -ForegroundColor Yellow
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$installerRoot = $PSScriptRoot
$stageDir = Join-Path $installerRoot "_stage"
$sedPath = Join-Path $installerRoot "AppGPP-Installer.sed"
$outputPath = if ([System.IO.Path]::IsPathRooted($OutputExe)) { $OutputExe } else { Join-Path $projectRoot $OutputExe }
$outputDir = Split-Path -Parent $outputPath

if (-not (Get-Command iexpress -ErrorAction SilentlyContinue)) {
  throw "IExpress nao encontrado neste Windows."
}

Write-Step "Validando build de producao (.next)"
if (-not (Test-Path (Join-Path $projectRoot ".next"))) {
  throw "Pasta .next nao encontrada. Execute 'npm run build' antes de gerar o instalador."
}

Write-Step "Limpando stage"
if (Test-Path $stageDir) { Remove-Item -LiteralPath $stageDir -Recurse -Force }
New-Item -ItemType Directory -Path $stageDir -Force | Out-Null
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

Write-Step "Copiando arquivos essenciais"
$filesToCopy = @(
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "middleware.ts",
  "Abrir-AppGPP.cmd",
  "AppGPP-Tray.ps1",
  "Criar-Atalho-AreaTrabalho.ps1",
  ".env.example"
)
foreach ($item in $filesToCopy) {
  $src = Join-Path $projectRoot $item
  if (Test-Path $src) { Copy-Item -LiteralPath $src -Destination (Join-Path $stageDir $item) -Force }
}

$dirsToCopy = @(".next", "public", "prisma")
foreach ($dir in $dirsToCopy) {
  $src = Join-Path $projectRoot $dir
  if (Test-Path $src) {
    Copy-Item -LiteralPath $src -Destination (Join-Path $stageDir $dir) -Recurse -Force
  }
}

Copy-Item -LiteralPath (Join-Path $installerRoot "Install-AppGPP.ps1") -Destination (Join-Path $stageDir "Install-AppGPP.ps1") -Force

Write-Step "Montando lista de arquivos"
$files = Get-ChildItem -LiteralPath $stageDir -Recurse -File | ForEach-Object { $_.FullName }
if (-not $files) { throw "Nenhum arquivo no stage para empacotar." }

$sed = @()
$sed += "[Version]"
$sed += "Class=IEXPRESS"
$sed += "SEDVersion=3"
$sed += "[Options]"
$sed += "PackagePurpose=InstallApp"
$sed += "ShowInstallProgramWindow=1"
$sed += "HideExtractAnimation=1"
$sed += "UseLongFileName=1"
$sed += "InsideCompressed=0"
$sed += "CAB_FixedSize=0"
$sed += "CAB_ResvCodeSigning=0"
$sed += "RebootMode=N"
$sed += "InstallPrompt="
$sed += "DisplayLicense="
$sed += "FinishMessage=Instalacao do AppGPP concluida."
$sed += "TargetName=$outputPath"
$sed += "FriendlyName=Instalador AppGPP"
$sed += "AppLaunched=powershell.exe -NoProfile -ExecutionPolicy Bypass -File Install-AppGPP.ps1"
$sed += "PostInstallCmd=<None>"
$sed += "AdminQuietInstCmd=powershell.exe -NoProfile -ExecutionPolicy Bypass -File Install-AppGPP.ps1"
$sed += "UserQuietInstCmd=powershell.exe -NoProfile -ExecutionPolicy Bypass -File Install-AppGPP.ps1"
$sed += "SourceFiles=SourceFiles"
$sed += "[Strings]"
$sed += "FILECOUNT=$($files.Count)"
$sed += "[SourceFiles]"
$sed += "SourceFiles0=$stageDir"
$sed += "[SourceFiles0]"

$idx = 0
foreach ($file in $files) {
  $relative = $file.Substring($stageDir.Length).TrimStart('\\')
  $sed += "$idx=$relative"
  $idx++
}

Set-Content -LiteralPath $sedPath -Value $sed -Encoding ASCII

Write-Step "Gerando EXE"
& iexpress /N $sedPath | Out-Null
if ($LASTEXITCODE -ne 0) { throw "IExpress falhou com codigo $LASTEXITCODE" }
if (-not (Test-Path $outputPath)) { throw "EXE nao foi criado: $outputPath" }

Write-Step "Instalador gerado em: $outputPath"
