@echo off
echo ========================================
echo  GJTS Karnataka Website - Starting...
echo ========================================
echo.
echo Starting Next.js Development Server...
echo.
echo The website will be available at:
echo http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

powershell -ExecutionPolicy Bypass -Command "npm run dev"
