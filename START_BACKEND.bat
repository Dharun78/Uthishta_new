@echo off
echo ========================================
echo  GJTS Karnataka Backend - Starting...
echo ========================================
echo.
echo Starting Express Backend Server...
echo.
echo The backend will be available at:
echo http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

powershell -ExecutionPolicy Bypass -Command "npm run server"
