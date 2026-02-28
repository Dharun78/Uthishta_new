@echo off
echo ========================================
echo GJTS Karnataka Website - Backend Setup
echo ========================================
echo.

echo Step 1: Checking MongoDB...
mongosh --eval "db.version()" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MongoDB is not running!
    echo Please start MongoDB first.
    echo.
    pause
    exit /b 1
)
echo [OK] MongoDB is running
echo.

echo Step 2: Seeding database...
node scripts/seed-database.js
if %errorlevel% neq 0 (
    echo [ERROR] Database seeding failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo Backend Setup Complete!
echo ========================================
echo.
echo You can now:
echo 1. Start the website: npm run dev
echo 2. Login: http://localhost:3000/dashboard/login
echo 3. Credentials: superadmin / super123
echo.
pause
