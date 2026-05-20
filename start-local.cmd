@echo off
setlocal

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-local.ps1" %*
set EXIT_CODE=%errorlevel%
echo.
echo Local dev server exited with code %EXIT_CODE%.
pause
exit /b %EXIT_CODE%
