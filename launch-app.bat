@echo off
title Student Offline Database
echo ============================================
echo   Student Offline Database - Starting...
echo ============================================
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies first...
    call npm install
    echo.
)

:: Check if .next build exists
if not exist ".next" (
    echo Building the application... (This may take a minute)
    call npm run build
    echo.
)

:: Launch the Electron app (it will start Next.js server internally)
echo Launching Student Offline Database...
echo.
npx electron .

:: If Electron exits, also kill any lingering Next.js server
echo.
echo Application closed.
timeout /t 2 /nobreak >nul