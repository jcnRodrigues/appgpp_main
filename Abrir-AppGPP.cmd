@echo off
setlocal

set "APP_DIR=%~dp0"
cd /d "%APP_DIR%"

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERRO] npm nao encontrado. Instale o Node.js 20+ e tente novamente.
  pause
  exit /b 1
)

echo Iniciando AppGPP...
start "AppGPP Server" cmd /k "cd /d "%APP_DIR%" && npm run dev"

REM Aguarda o servidor subir antes de abrir o navegador
timeout /t 6 /nobreak >nul
start "" "http://localhost:3000"

exit /b 0
