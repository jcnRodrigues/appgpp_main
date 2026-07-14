param(
  [string]$InstallerPattern = "dist/AppGPP-Installer-*.exe",
  [string]$PayloadPath = "dist/AppGPP-Payload.zip",
  [string]$OutputZip = "dist/Instalador APPGPP.zip"
)

$ErrorActionPreference = "Stop"

$exe = Get-ChildItem $InstallerPattern -File | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $exe) { throw "Instalador EXE nao encontrado." }
if (-not (Test-Path -LiteralPath $PayloadPath)) { throw "Payload ZIP nao encontrado." }

if (Test-Path -LiteralPath $OutputZip) {
  Remove-Item -LiteralPath $OutputZip -Force
}

$tempDir = Join-Path $env:TEMP ("appgpp-final-zip-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

try {
  Start-Sleep -Seconds 2
  Copy-Item -LiteralPath $exe.FullName -Destination (Join-Path $tempDir $exe.Name) -Force
  Copy-Item -LiteralPath $PayloadPath -Destination (Join-Path $tempDir (Split-Path -Leaf $PayloadPath)) -Force
  tar -a -cf $OutputZip -C $tempDir $exe.Name (Split-Path -Leaf $PayloadPath)
  if ($LASTEXITCODE -ne 0) { throw "Falha ao criar ZIP final com tar: $LASTEXITCODE" }
} finally {
  Remove-Item -LiteralPath $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "ZIP final gerado em: $OutputZip"
