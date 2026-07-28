@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "INSTALLER_EXE=%SCRIPT_DIR%HostInventoryAgent-Installer.exe"
set "INSTALLER=%SCRIPT_DIR%HostInventoryAgent-Installer.ps1"

if exist "%INSTALLER_EXE%" (
  start "" "%INSTALLER_EXE%"
  exit /b 0
)

if not exist "%INSTALLER%" (
  echo Nao foi possivel localizar o instalador: %INSTALLER%
  pause
  exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%INSTALLER%"

endlocal
