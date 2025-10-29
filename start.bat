@echo off
echo ============================================
echo  KLH Peer Learning Platform
echo  Starting Backend and Frontend Servers
echo ============================================
echo.

echo [1/2] Starting Backend Server on port 5000...
cd backend
start "KLH Backend" cmd /k "npm start"
timeout /t 3 /nobreak > nul
echo     Backend server started!
echo.

echo [2/2] Starting Frontend Server on port 3000...
cd ..\frontend
start "KLH Frontend" cmd /k "npm start"
timeout /t 3 /nobreak > nul
echo     Frontend server started!
echo.

echo ============================================
echo  SERVERS STARTED SUCCESSFULLY!
echo ============================================
echo.
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo.
echo  Press any key to view the application...
pause > nul

start http://localhost:3000

echo.
echo  Close the terminal windows to stop the servers.
echo.
