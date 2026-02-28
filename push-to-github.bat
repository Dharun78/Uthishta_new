@echo off
echo ========================================
echo Pushing GJTS Karnataka Website to GitHub
echo ========================================
echo.

REM Initialize git if not already done
if not exist .git (
    echo Initializing Git repository...
    git init
)

REM Configure git user
echo Configuring Git user...
git config user.name "Dharun78"
git config user.email "dharun@example.com"

REM Add all files
echo Adding all files...
git add .

REM Commit changes
echo Committing changes...
git commit -m "Complete GJTS Karnataka website with grants chatbot, database cleanup, and UI improvements"

REM Add remote if not exists
echo Adding remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/Dharun78/Uthishta_new.git

REM Push to GitHub
echo Pushing to GitHub...
git branch -M main
git push -u origin main --force

echo.
echo ========================================
echo Done! Check https://github.com/Dharun78/Uthishta_new
echo ========================================
pause
