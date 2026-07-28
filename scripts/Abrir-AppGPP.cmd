@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "APP_MODE=start"
set "APP_VIEW=tray"

if /I "%~1"=="dev" set "APP_MODE=dev"
if /I "%~1"=="--dev" set "APP_MODE=dev"
if /I "%~1"=="-dev" set "APP_MODE=dev"
if /I "%~2"=="dev" set "APP_MODE=dev"
if /I "%~2"=="--dev" set "APP_MODE=dev"
if /I "%~2"=="-dev" set "APP_MODE=dev"

if /I "%~1"=="console" set "APP_VIEW=console"
if /I "%~1"=="--console" set "APP_VIEW=console"
if /I "%~1"=="-console" set "APP_VIEW=console"
if /I "%~1"=="foreground" set "APP_VIEW=console"
if /I "%~1"=="--foreground" set "APP_VIEW=console"
if /I "%~1"=="-foreground" set "APP_VIEW=console"
if /I "%~2"=="console" set "APP_VIEW=console"
if /I "%~2"=="--console" set "APP_VIEW=console"
if /I "%~2"=="-console" set "APP_VIEW=console"
if /I "%~2"=="foreground" set "APP_VIEW=console"
if /I "%~2"=="--foreground" set "APP_VIEW=console"
if /I "%~2"=="-foreground" set "APP_VIEW=console"
for %%I in ("%SCRIPT_DIR%..") do set "APP_DIR=%%~fI\"
cd /d "%APP_DIR%"
set "CFG=%APP_DIR%appgpp-server.env"
set "HOST=localhost"
set "PORT=3000"

if exist "%CFG%" (
  for /f "usebackq tokens=1,* delims==" %%A in ("%CFG%") do (
    if /I "%%A"=="APPGPP_PUBLIC_HOST" set "HOST=%%B"
    if /I "%%A"=="APPGPP_PORT" set "PORT=%%B"
  )
)

if /I "%APP_MODE%"=="dev" (
  set "HOST=localhost"
)

if /I "%APP_VIEW%"=="console" (
  if /I "%APP_MODE%"=="dev" (
    echo [AppGPP] Modo console dev ativado.
  ) else (
    echo [AppGPP] Modo console ativado.
  )
  echo [AppGPP] Pasta do projeto: %APP_DIR%
  echo [AppGPP] Abrindo o navegador em %HOST%:%PORT%
  start "" "http://%HOST%:%PORT%"
  echo [AppGPP] Iniciando o servidor no terminal do VS Code...
  if exist "%SCRIPT_DIR%Start-AppGPP-Server.ps1" (
    if /I "%APP_MODE%"=="dev" (
      powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%Start-AppGPP-Server.ps1" -Foreground -Dev
    ) else (
      powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%Start-AppGPP-Server.ps1" -Foreground
    )
  ) else (
    if /I "%APP_MODE%"=="dev" (
      powershell -NoProfile -ExecutionPolicy Bypass -File "%APP_DIR%AppGPP-Start.ps1" -Foreground -Dev
    ) else (
      powershell -NoProfile -ExecutionPolicy Bypass -File "%APP_DIR%AppGPP-Start.ps1" -Foreground
    )
  )
  exit /b %ERRORLEVEL%
)

if exist "%APP_DIR%AppGPP-Start.exe" (
  if /I "%APP_MODE%"=="dev" (
    start "" "%APP_DIR%AppGPP-Start.exe" -Dev
  ) else (
    start "" "%APP_DIR%AppGPP-Start.exe"
  )
  exit /b 0
)

if exist "%APP_DIR%AppGPP-Start.ps1" (
  if /I "%APP_MODE%"=="dev" (
    powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%APP_DIR%AppGPP-Start.ps1" -Dev >nul 2>nul
  ) else (
    powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%APP_DIR%AppGPP-Start.ps1" >nul 2>nul
  )
  exit /b 0
)

if exist "%SCRIPT_DIR%Start-AppGPP-Server.ps1" (
  if /I "%APP_MODE%"=="dev" (
    powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%SCRIPT_DIR%Start-AppGPP-Server.ps1" -Dev >nul 2>nul
  ) else (
    powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%SCRIPT_DIR%Start-AppGPP-Server.ps1" >nul 2>nul
  )
)

exit /b 0
