@echo off
title KLH Peer Learning Platform
color 0A

echo =========================================
echo  KLH PEER LEARNING PLATFORM
echo =========================================
echo.

echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    pause
    exit /b 1
)
echo Node.js is installed: 
node --version
echo.

echo [2/3] Starting Backend Server...
cd /d "%~dp0backend"
start "Backend Server - Port 5000" cmd /k "echo Starting Backend... && node server.js"
timeout /t 3 /nobreak >nul
echo Backend server starting on port 5000...
echo.

echo [3/3] Starting Frontend Server...
cd /d "%~dp0frontend"
start "Frontend Server - Port 3000" cmd /k "echo Starting Frontend... && npm start"
echo Frontend server starting on port 3000...
echo.

echo =========================================
echo  SERVERS ARE STARTING!
echo =========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo TEST CREDENTIALS:
echo Email:    rajesh.kumar@klh.edu.in
echo Password: password123
echo.
echo Press any key to open the browser...
pause >nul

start http://localhost:3000

echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause
