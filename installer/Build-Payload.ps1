Add-Type -AssemblyName System.IO.Compression.FileSystem

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$distDir = Join-Path $projectRoot "dist"
$payloadPath = Join-Path $distDir "AppGPP-Payload.zip"
$stageDir = Join-Path $PSScriptRoot "_payload_stage"

if (Test-Path $stageDir) { Remove-Item -LiteralPath $stageDir -Recurse -Force }
New-Item -ItemType Directory -Path $stageDir -Force | Out-Null
New-Item -ItemType Directory -Path $distDir -Force | Out-Null

$excludeDirs = @(".git", "node_modules", ".next", ".netlify", ".vscode", "dist", "installer")
$excludeFiles = @("*.log", "npm-debug.log*", "*.tmp*", "tsconfig.tsbuildinfo")

$robocopyArgs = @(
  $projectRoot,
  $stageDir,
  "/E",
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

if (Test-Path $payloadPath) { Remove-Item -LiteralPath $payloadPath -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($stageDir, $payloadPath)

Write-Host "Payload gerado em: $payloadPath"
