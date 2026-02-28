@echo off
echo Restarting Next.js development server...
echo.
echo Step 1: Clearing Next.js cache...
if exist .next (
    rmdir /s /q .next
    echo Cache cleared!
) else (
    echo No cache to clear.
)
echo.
echo Step 2: Starting development server...
echo Press Ctrl+C to stop the server when needed.
echo.
npm run dev
