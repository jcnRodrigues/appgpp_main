@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Emitir-Certificado-LetsEncrypt.ps1" %*
exit /b %errorlevel%
