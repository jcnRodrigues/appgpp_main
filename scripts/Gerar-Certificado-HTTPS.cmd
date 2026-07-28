@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Gerar-Certificado-HTTPS.ps1" %*
exit /b %errorlevel%
