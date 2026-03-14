@echo off
echo ========================================
echo   Starting HerbalKyore Full-Stack App
echo ========================================
echo.
echo Starting Backend Server...
cd herbalkyore-backend
start cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend React App...
cd ..\herbalkyore-ui
start cmd /k "npm start"
echo.
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
