@echo off
setlocal

set "APP_DIR=%~dp0.."
for %%I in ("%APP_DIR%") do set "APP_DIR=%%~fI"
cd /d "%APP_DIR%"

set "COMPOSE_ARGS=-f docker-compose.yml -f docker-compose.lan.yml"
set "URL="
set "LAN_HOST="
set "LAN_URL="
set "LAN_PORT=80"

if not exist ".env" if exist ".env.docker.example" (
  copy /Y ".env.docker.example" ".env" >nul
)

if exist ".env" (
  for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    if /I "%%A"=="APPGPP_LAN_HOST" set "LAN_HOST=%%~B"
    if /I "%%A"=="APPGPP_LAN_URL" set "LAN_URL=%%~B"
    if /I "%%A"=="APPGPP_HTTP_PORT" set "LAN_PORT=%%~B"
  )
)

if not defined LAN_HOST (
  for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "$ip = Get-NetIPAddress -AddressFamily IPv4 ^| Where-Object { $_.IPAddress -ne '127.0.0.1' -and $_.IPAddress -notlike '169.254*' } ^| Select-Object -First 1 -ExpandProperty IPAddress; if ($ip) { $ip }"`) do set "LAN_HOST=%%I"
)

if not defined LAN_URL (
  if /I "%LAN_PORT%"=="80" (
    set "LAN_URL=http://%LAN_HOST%"
  ) else (
    set "LAN_URL=http://%LAN_HOST%:%LAN_PORT%"
  )
)

where docker >nul 2>nul
if errorlevel 1 (
  echo Docker nao encontrado no PATH.
  exit /b 1
)

docker compose %COMPOSE_ARGS% up -d --build
if errorlevel 1 (
  echo Falha ao subir o ambiente Docker LAN.
  exit /b 1
)

timeout /t 5 /nobreak >nul
start "" "%LAN_URL%"

exit /b 0
