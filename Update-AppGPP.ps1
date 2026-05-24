param(
  [string]$SourceDir,
  [string]$InstallDir = "C:\\AppGPP"
)

$ErrorActionPreference = "Stop"

function Step($m){ Write-Host "[Update-AppGPP] $m" -ForegroundColor Yellow }

if ([string]::IsNullOrWhiteSpace($SourceDir)) {
  throw "Informe -SourceDir com a pasta da nova versao do AppGPP."
}
if (-not (Test-Path -LiteralPath $SourceDir)) {
  throw "SourceDir nao encontrado: $SourceDir"
}
if (-not (Test-Path -LiteralPath $InstallDir)) {
  throw "InstallDir nao encontrado: $InstallDir"
}

$backupRoot = Join-Path $InstallDir "_backups"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = Join-Path $backupRoot $timestamp

Step "Parando AppGPP"
powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $InstallDir "Stop-AppGPP-Server.ps1") -InstallDir $InstallDir

Step "Criando backup da instalacao atual"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
& robocopy $InstallDir $backupDir /E /R:2 /W:1 /NFL /NDL /NJH /NJS /NP /XD "$InstallDir\node_modules" "$InstallDir\.next" "$InstallDir\_backups" | Out-Null
if ($LASTEXITCODE -ge 8) { throw "Falha ao criar backup (robocopy $LASTEXITCODE)" }

Step "Atualizando arquivos"
$excludeDirs = @(".git", "node_modules", ".next", "dist", "installer", ".netlify", ".vscode", "_backups")
$robocopyArgs = @($SourceDir, $InstallDir, "/E", "/R:2", "/W:1", "/NFL", "/NDL", "/NJH", "/NJS", "/NP")
foreach ($d in $excludeDirs) { $robocopyArgs += @("/XD", (Join-Path $SourceDir $d)) }
& robocopy @robocopyArgs | Out-Null
if ($LASTEXITCODE -ge 8) { throw "Falha ao atualizar arquivos (robocopy $LASTEXITCODE)" }

Push-Location $InstallDir
try {
  Step "Instalando dependencias"
  npm install --no-audit --no-fund

  Step "Gerando build de producao"
  npm run build
} catch {
  Step "Falha na validacao. Restaurando backup..."
  & robocopy $backupDir $InstallDir /E /MIR /R:2 /W:1 /NFL /NDL /NJH /NJS /NP | Out-Null
  Pop-Location
  powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $InstallDir "Start-AppGPP-Server.ps1") | Out-Null
  throw "Update revertido para backup $backupDir. Motivo: $($_.Exception.Message)"
}
Pop-Location

Step "Iniciando AppGPP"
powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $InstallDir "Start-AppGPP-Server.ps1") | Out-Null

Step "Atualizacao concluida com sucesso"
Write-Host "Backup criado em: $backupDir"
