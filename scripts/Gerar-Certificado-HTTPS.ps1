param(
  [string]$OutputDir = (Join-Path $PSScriptRoot "..\nginx\certs"),
  [string]$CommonName = "localhost",
  [string[]]$DnsNames = @("localhost", "127.0.0.1"),
  [switch]$Force
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host "[AppGPP] $Message" -ForegroundColor Cyan
}

function Ensure-Command {
  param(
    [string]$Name,
    [string]$HelpMessage
  )

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "$Name nao encontrado. $HelpMessage"
  }
}

Ensure-Command -Name "openssl" -HelpMessage "Instale o OpenSSL ou o Git for Windows para converter o certificado para PEM."

$resolvedOutputDir = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot $OutputDir))
New-Item -ItemType Directory -Path $resolvedOutputDir -Force | Out-Null

$crtPath = Join-Path $resolvedOutputDir "appgpp.crt"
$keyPath = Join-Path $resolvedOutputDir "appgpp.key"

if (-not $Force) {
  if ((Test-Path -LiteralPath $crtPath) -or (Test-Path -LiteralPath $keyPath)) {
    throw "Ja existem arquivos em $resolvedOutputDir. Use -Force para sobrescrever."
  }
}

$subject = "CN=$CommonName"
$cert = New-SelfSignedCertificate -DnsName $DnsNames -Subject $subject -CertStoreLocation "Cert:\CurrentUser\My" -NotAfter (Get-Date).AddYears(2) -KeyExportPolicy Exportable -KeyLength 2048 -HashAlgorithm sha256

$pfxPath = Join-Path $env:TEMP ("AppGPP-HTTPS-" + [guid]::NewGuid().ToString("N") + ".pfx")
$pfxPasswordText = [guid]::NewGuid().ToString("N") + "!"
$pfxPassword = ConvertTo-SecureString -String $pfxPasswordText -AsPlainText -Force

try {
  Export-PfxCertificate -Cert $cert -FilePath $pfxPath -Password $pfxPassword | Out-Null

  Write-Step "Convertendo PFX para PEM em $resolvedOutputDir"
  & openssl pkcs12 -in $pfxPath -clcerts -nokeys -out $crtPath -passin ("pass:{0}" -f $pfxPasswordText) | Out-Null
  & openssl pkcs12 -in $pfxPath -nocerts -nodes -out $keyPath -passin ("pass:{0}" -f $pfxPasswordText) | Out-Null
} finally {
  Remove-Item -LiteralPath $pfxPath -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath ("Cert:\CurrentUser\My\" + $cert.Thumbprint) -Force -ErrorAction SilentlyContinue
}

Write-Step "Certificados gerados:"
Write-Host $crtPath
Write-Host $keyPath
