@echo off
echo ========================================
echo  CLEANING AND RESEEDING GRANTS DATABASE
echo ========================================
echo.
echo This will:
echo 1. Delete ALL existing grants (including gibberish ones)
echo 2. Insert 10 clean, properly formatted grants
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul
echo.
echo Running cleanup script...
node scripts/clean-and-seed-grants.js
echo.
echo ========================================
echo  DONE! Please refresh your browser.
echo ========================================
pause
