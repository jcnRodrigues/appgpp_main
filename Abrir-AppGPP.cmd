@echo off
setlocal

set "APP_DIR=%~dp0"
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

if exist "%APP_DIR%Start-AppGPP-Server.ps1" (
  powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%APP_DIR%Start-AppGPP-Server.ps1" >nul 2>nul
)

start "" "http://%HOST%:%PORT%"

exit /b 0
