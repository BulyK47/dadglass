@echo off
setlocal
cd /d "%~dp0"

echo.
echo DadGlass - Offline / Installable Build
echo --------------------------------------
echo This builds the app and serves the offline version at:
echo   http://127.0.0.1:5174/
echo.
echo First load must be online so the app can cache itself.
echo After that it works offline, and you can "Add to Home Screen"
echo (phone) or "Install" (desktop browser) to use it like an app.
echo.

echo Building...
call npm run build
if errorlevel 1 (
  echo.
  echo Build failed. Fix the errors above and try again.
  pause
  exit /b 1
)

start "" powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Milliseconds 1500; Start-Process 'http://127.0.0.1:5174/'"
npm run preview:phone

echo.
echo The offline preview server stopped.
pause
