@echo off
setlocal

set "APP_DIR=%~dp0.."
for %%I in ("%APP_DIR%") do set "APP_DIR=%%~fI"
cd /d "%APP_DIR%"

set "COMPOSE_ARGS=-f docker-compose.yml"
set "URL=http://localhost"
set "PROTOCOL=http"
set "APPGPP_PUBLIC_URL="
set "NEXTAUTH_URL="
set "NGINX_SERVER_NAME="
set "LAN_IP="

if exist "nginx\default-https.conf" if exist "nginx\certs\appgpp.crt" if exist "nginx\certs\appgpp.key" (
  set "COMPOSE_ARGS=-f docker-compose.yml -f docker-compose.https.yml"
  set "PROTOCOL=https"
  set "URL=https://localhost"
)

if not exist ".env" if exist ".env.docker.example" (
  copy /Y ".env.docker.example" ".env" >nul
)

if exist ".env" (
  for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    if /I "%%A"=="APPGPP_PUBLIC_URL" set "APPGPP_PUBLIC_URL=%%~B"
    if /I "%%A"=="NEXTAUTH_URL" set "NEXTAUTH_URL=%%~B"
    if /I "%%A"=="NGINX_SERVER_NAME" set "NGINX_SERVER_NAME=%%~B"
  )
)

if defined APPGPP_PUBLIC_URL (
  set "URL=%APPGPP_PUBLIC_URL%"
)

if not defined APPGPP_PUBLIC_URL if defined NEXTAUTH_URL (
  set "URL=%NEXTAUTH_URL%"
)

if not defined APPGPP_PUBLIC_URL if not defined NEXTAUTH_URL if defined NGINX_SERVER_NAME (
  set "TARGET_HOST=%NGINX_SERVER_NAME%"
  if /I not "%TARGET_HOST%"=="_" if /I not "%TARGET_HOST%"=="localhost" (
    set "URL=%PROTOCOL%://%TARGET_HOST%"
  )
)

if /I "%URL%"=="http://localhost" if /I "%COMPOSE_ARGS%"=="-f docker-compose.yml" (
  for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "$ip = Get-NetIPAddress -AddressFamily IPv4 ^| Where-Object { $_.IPAddress -ne '127.0.0.1' -and $_.IPAddress -notlike '169.254*' } ^| Select-Object -First 1 -ExpandProperty IPAddress; if ($ip) { $ip }"`) do set "LAN_IP=%%I"
  if defined LAN_IP (
    set "URL=http://%LAN_IP%"
  )
)

if /I "%URL%"=="https://localhost" if /I "%COMPOSE_ARGS%"=="-f docker-compose.yml -f docker-compose.https.yml" (
  for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "$ip = Get-NetIPAddress -AddressFamily IPv4 ^| Where-Object { $_.IPAddress -ne '127.0.0.1' -and $_.IPAddress -notlike '169.254*' } ^| Select-Object -First 1 -ExpandProperty IPAddress; if ($ip) { $ip }"`) do set "LAN_IP=%%I"
  if defined LAN_IP (
    set "URL=https://%LAN_IP%"
  )
)

if defined LAN_IP (
  if /I "%APPGPP_PUBLIC_URL%"=="http://localhost" set "APPGPP_PUBLIC_URL=http://%LAN_IP%"
  if /I "%APPGPP_PUBLIC_URL%"=="https://localhost" set "APPGPP_PUBLIC_URL=https://%LAN_IP%"
  if /I "%NEXTAUTH_URL%"=="http://localhost" set "NEXTAUTH_URL=http://%LAN_IP%"
  if /I "%NEXTAUTH_URL%"=="https://localhost" set "NEXTAUTH_URL=https://%LAN_IP%"
  if /I "%NGINX_SERVER_NAME%"=="_" set "NGINX_SERVER_NAME=%LAN_IP%"
  if /I "%NGINX_SERVER_NAME%"=="localhost" set "NGINX_SERVER_NAME=%LAN_IP%"
  if not defined APPGPP_PUBLIC_URL set "APPGPP_PUBLIC_URL=%URL%"
  if not defined NEXTAUTH_URL set "NEXTAUTH_URL=%URL%"
)

where docker >nul 2>nul
if errorlevel 1 (
  echo Docker nao encontrado no PATH.
  exit /b 1
)

docker compose %COMPOSE_ARGS% up -d --build
if errorlevel 1 (
  echo Falha ao subir o ambiente Docker.
  exit /b 1
)

timeout /t 5 /nobreak >nul
start "" "%URL%"

exit /b 0
