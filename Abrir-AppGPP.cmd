@echo off
setlocal

set "APP_DIR=%~dp0"
cd /d "%APP_DIR%"
set "TRAY_SCRIPT=%APP_DIR%AppGPP-Tray.ps1"

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERRO] npm nao encontrado. Instale o Node.js 20+ e tente novamente.
  pause
  exit /b 1
)

if not exist "%TRAY_SCRIPT%" (
  echo [ERRO] Script da bandeja nao encontrado: "%TRAY_SCRIPT%"
  pause
  exit /b 1
)

echo Iniciando AppGPP na bandeja do sistema...
powershell -NoProfile -ExecutionPolicy Bypass -STA -WindowStyle Hidden -File "%TRAY_SCRIPT%"

exit /b 0
