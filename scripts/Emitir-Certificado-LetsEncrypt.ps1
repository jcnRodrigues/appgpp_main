param(
  [string]$Domain = "",
  [string]$Email = "",
  [switch]$Staging
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host "[AppGPP] $Message" -ForegroundColor Cyan
}

function Set-Or-ReplaceEnvValue {
  param(
    [string]$EnvFilePath,
    [string]$Key,
    [string]$Value
  )

  $lines = @()
  if (Test-Path -LiteralPath $EnvFilePath) {
    $lines = Get-Content -LiteralPath $EnvFilePath
  }

  $updated = $false
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "^\s*$Key=") {
      $lines[$i] = "$Key=`"$Value`""
      $updated = $true
      break
    }
  }

  if (-not $updated) {
    $lines += "$Key=`"$Value`""
  }

  Set-Content -LiteralPath $EnvFilePath -Value $lines -Encoding ASCII
}

if ([string]::IsNullOrWhiteSpace($Domain)) {
  throw "Informe o dominio com -Domain, por exemplo: -Domain app.seudominio.com"
}

if ([string]::IsNullOrWhiteSpace($Email)) {
  throw "Informe o e-mail com -Email, por exemplo: -Email admin@empresa.com"
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw "Docker nao encontrado no PATH."
}

$envPath = Join-Path (Get-Location) ".env"
if (-not (Test-Path -LiteralPath $envPath) -and (Test-Path -LiteralPath ".env.docker.example")) {
  Copy-Item -LiteralPath ".env.docker.example" -Destination $envPath
}

if (Test-Path -LiteralPath $envPath) {
  Set-Or-ReplaceEnvValue -EnvFilePath $envPath -Key "NGINX_SERVER_NAME" -Value $Domain
  Set-Or-ReplaceEnvValue -EnvFilePath $envPath -Key "LETSENCRYPT_CERT_NAME" -Value $Domain
  Set-Or-ReplaceEnvValue -EnvFilePath $envPath -Key "NEXTAUTH_URL" -Value ("https://{0}" -f $Domain)
  Set-Or-ReplaceEnvValue -EnvFilePath $envPath -Key "APPGPP_PUBLIC_URL" -Value ("https://{0}" -f $Domain)
}

$env:NGINX_SERVER_NAME = $Domain
$env:LETSENCRYPT_CERT_NAME = $Domain
$env:NEXTAUTH_URL = "https://$Domain"
$env:APPGPP_PUBLIC_URL = "https://$Domain"

Write-Step "Subindo NGINX para validacao ACME"
& docker compose -f docker-compose.yml up -d nginx
if ($LASTEXITCODE -ne 0) {
  throw "Falha ao subir o NGINX."
}

Write-Step "Emitindo certificado Let's Encrypt para $Domain"
$certbotArgs = @(
  "compose",
  "-f", "docker-compose.yml",
  "-f", "docker-compose.letsencrypt.yml",
  "run", "--rm", "certbot",
  "certonly",
  "--webroot",
  "-w", "/var/www/certbot",
  "--email", $Email,
  "--agree-tos",
  "--no-eff-email"
)

if ($Staging) {
  $certbotArgs += "--staging"
}

$certbotArgs += @("-d", $Domain)

& docker @certbotArgs
if ($LASTEXITCODE -ne 0) {
  throw "Falha ao emitir o certificado Let's Encrypt."
}

Write-Step "Subindo stack completo com HTTPS e renovacao automatica"
& docker compose -f docker-compose.yml -f docker-compose.letsencrypt.yml -f docker-compose.letsencrypt-nginx.yml up -d --build
if ($LASTEXITCODE -ne 0) {
  throw "Certificado emitido, mas falhou ao subir o stack completo."
}

Write-Step "Certificado emitido e stack HTTPS iniciado com renovacao automatica."
