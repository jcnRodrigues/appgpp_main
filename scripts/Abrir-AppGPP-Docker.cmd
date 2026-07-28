@echo off
setlocal

set "APP_DIR=%~dp0.."
for %%I in ("%APP_DIR%") do set "APP_DIR=%%~fI"
cd /d "%APP_DIR%"

set "COMPOSE_ARGS=-f docker-compose.yml"
set "URL=http://localhost"
set "NGINX_SERVER_NAME="

if exist "nginx\default-https.conf" if exist "nginx\certs\appgpp.crt" if exist "nginx\certs\appgpp.key" (
  set "COMPOSE_ARGS=-f docker-compose.yml -f docker-compose.https.yml"
  set "URL=https://localhost"
)

if not exist ".env" if exist ".env.docker.example" (
  copy /Y ".env.docker.example" ".env" >nul
)

if exist ".env" (
  for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    if /I "%%A"=="NGINX_SERVER_NAME" set "NGINX_SERVER_NAME=%%~B"
  )
)

if defined NGINX_SERVER_NAME (
  set "TARGET_HOST=%NGINX_SERVER_NAME%"
  if /I "%TARGET_HOST%"=="_" set "TARGET_HOST=localhost"
  if "%COMPOSE_ARGS%"=="-f docker-compose.yml -f docker-compose.https.yml" (
    set "URL=https://%TARGET_HOST%"
  ) else (
    set "URL=http://%TARGET_HOST%"
  )
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
