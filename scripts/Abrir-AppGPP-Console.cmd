@echo off
setlocal

set "SCRIPT_DIR=%~dp0"

if /I "%~1"=="dev" (
  call "%SCRIPT_DIR%Abrir-AppGPP.cmd" console dev
) else if /I "%~1"=="--dev" (
  call "%SCRIPT_DIR%Abrir-AppGPP.cmd" console dev
) else if /I "%~1"=="-dev" (
  call "%SCRIPT_DIR%Abrir-AppGPP.cmd" console dev
) else (
  call "%SCRIPT_DIR%Abrir-AppGPP.cmd" console
)

exit /b %ERRORLEVEL%
