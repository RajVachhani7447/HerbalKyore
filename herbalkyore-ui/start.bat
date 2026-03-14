@echo off
REM HerbalKyore React App - Quick Start for Windows

echo.
echo ================================
echo  HerbalKyore React App
echo ================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Choose an option:
echo 1. Start development server
echo 2. Build for production
echo 3. Install/Update dependencies
echo 4. Open in browser after starting
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo Starting development server...
    echo Your app will open at http://localhost:3000
    echo.
    call npm start
) else if "%choice%"=="2" (
    echo.
    echo Building for production...
    call npm run build
    echo.
    echo Build complete! Check the 'build' folder.
    pause
) else if "%choice%"=="3" (
    echo.
    echo Installing/Updating dependencies...
    call npm install
    echo.
    echo Done!
    pause
) else if "%choice%"=="4" (
    echo.
    echo Starting development server and opening browser...
    start http://localhost:3000
    call npm start
) else if "%choice%"=="5" (
    echo.
    echo Goodbye!
    exit
) else (
    echo.
    echo Invalid choice. Please run the script again.
    pause
)
