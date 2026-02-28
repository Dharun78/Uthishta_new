@echo off
echo ========================================
echo GJTS Karnataka Website - Setup Script
echo ========================================
echo.

REM Check if MongoDB is running
echo [1/4] Checking MongoDB status...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% equ 0 (
    echo ✓ MongoDB is running
) else (
    echo ✗ MongoDB is not running
    echo.
    echo Attempting to start MongoDB...
    net start MongoDB 2>nul
    if %errorlevel% equ 0 (
        echo ✓ MongoDB started successfully
    ) else (
        echo ✗ Could not start MongoDB automatically
        echo.
        echo Please install MongoDB from: https://www.mongodb.com/try/download/community
        echo Or start MongoDB manually if already installed
        echo.
        pause
        exit /b 1
    )
)
echo.

REM Check if node_modules exists
echo [2/4] Checking dependencies...
if exist "node_modules" (
    echo ✓ Dependencies installed
) else (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ✗ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✓ Dependencies installed
)
echo.

REM Check if database is seeded
echo [3/4] Checking database...
node scripts/check-database.js >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Database is ready
) else (
    echo Database needs to be seeded
    echo.
    echo Seeding database with sample data...
    node scripts/seed-database.js
    if %errorlevel% neq 0 (
        echo ✗ Failed to seed database
        echo Please check if MongoDB is running
        pause
        exit /b 1
    )
)
echo.

REM Start the development server
echo [4/4] Starting development server...
echo.
echo ========================================
echo Website will be available at:
echo   http://localhost:3000
echo.
echo Dashboard login:
echo   http://localhost:3000/dashboard/login
echo.
echo Credentials:
echo   Super Admin: superadmin / super123
echo   School Admin: admin_ballari / ballari123
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
