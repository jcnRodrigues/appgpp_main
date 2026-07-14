$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$distDir = Join-Path $projectRoot "dist"
$payloadPath = Join-Path $distDir "AppGPP-Payload.zip"
$stageDir = Join-Path $env:TEMP ("AppGPP_payload_stage_" + [guid]::NewGuid().ToString("N"))

New-Item -ItemType Directory -Path $stageDir -Force | Out-Null
New-Item -ItemType Directory -Path $distDir -Force | Out-Null

Get-ChildItem -LiteralPath $distDir -Filter 'AppGPP-Payload*.zip' -File -ErrorAction SilentlyContinue |
  Remove-Item -Force -ErrorAction SilentlyContinue

$excludeDirs = @(".git", ".vscode", "dist", "installer")
$excludeFiles = @("*.log", "npm-debug.log*", "*.tmp*", "tsconfig.tsbuildinfo")

$robocopyArgs = @(
  $projectRoot,
  $stageDir,
  "/E",
  "/XJ",
  "/COPY:DAT",
  "/DCOPY:DAT",
  "/R:2",
  "/W:1",
  "/NFL",
  "/NDL",
  "/NJH",
  "/NJS",
  "/NP"
)
foreach ($dir in $excludeDirs) { $robocopyArgs += @("/XD", (Join-Path $projectRoot $dir)) }
foreach ($file in $excludeFiles) { $robocopyArgs += @("/XF", $file) }
& robocopy @robocopyArgs | Out-Null
if ($LASTEXITCODE -ge 8) { throw "Falha no robocopy: $LASTEXITCODE" }

Copy-Item -LiteralPath (Join-Path $PSScriptRoot "Install-AppGPP.ps1") -Destination (Join-Path $stageDir "Install-AppGPP.ps1") -Force

$runtimeDir = Join-Path $stageDir "runtime"
New-Item -ItemType Directory -Path $runtimeDir -Force | Out-Null
$nodeSource = (Get-Command node).Source
$nodeRoot = Split-Path -Parent $nodeSource
$nodeTarget = Join-Path $runtimeDir "node"
New-Item -ItemType Directory -Path $nodeTarget -Force | Out-Null
& robocopy $nodeRoot $nodeTarget /E /XJ /COPY:DAT /DCOPY:DAT /R:2 /W:1 /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "Falha ao copiar runtime do Node.js: $LASTEXITCODE" }

$nodeVersion = (& $nodeSource --version).Trim()
Set-Content -LiteralPath (Join-Path $runtimeDir "node-version.txt") -Value $nodeVersion -Encoding ASCII

$buildArtifacts = @(
  ".next",
  "node_modules"
)
foreach ($artifact in $buildArtifacts) {
  $artifactPath = Join-Path $stageDir $artifact
  if (-not (Test-Path -LiteralPath $artifactPath)) {
    $sourcePath = Join-Path $projectRoot $artifact
    if (Test-Path -LiteralPath $sourcePath) {
      Copy-Item -LiteralPath $sourcePath -Destination $artifactPath -Recurse -Force
    }
  }
}

$pathsToPrune = @(
  ".next\cache",
  ".next\dev",
  ".next\turbopack",
  "node_modules\.cache"
)
foreach ($relativePath in $pathsToPrune) {
  $fullPath = Join-Path $stageDir $relativePath
  if (Test-Path -LiteralPath $fullPath) {
    Remove-Item -LiteralPath $fullPath -Recurse -Force -ErrorAction SilentlyContinue
  }
}

if (Test-Path $payloadPath) { Remove-Item -LiteralPath $payloadPath -Force }
tar -a -cf $payloadPath -C $stageDir .
if ($LASTEXITCODE -ne 0) { throw "Falha ao criar payload ZIP com tar: $LASTEXITCODE" }

Remove-Item -LiteralPath $stageDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Payload gerado em: $payloadPath"
