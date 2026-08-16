@echo off
setlocal
cd /d "%~dp0"

echo.
echo Dad-focused Pregnancy App
echo -------------------------
echo Starting the app at:
echo   http://127.0.0.1:5174/index.html
echo.
echo Keep this window open while you work.
echo Most code/content changes will update automatically in the browser.
echo If the Codex in-app browser shows an old error page, press Reload there.
echo.

start "" powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Milliseconds 1200; Start-Process 'http://127.0.0.1:5174/index.html'"
npm run dev:phone

echo.
echo The app server stopped.
pause
