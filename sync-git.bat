@echo off
echo ===================================================
echo   SAIDUL ISLAM PORTFOLIO - 1-CLICK GIT SYNC
echo ===================================================
echo.
echo Staging all changes...
git add .

set /p msg="Enter commit message (or press ENTER for default): "
if "%msg%"=="" set msg=Update portfolio content via automated sync [%date% %time%]

echo Committing with message: "%msg%"
git commit -m "%msg%"

echo.
echo Pushing to GitHub (origin main)...
git push origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ===================================================
    echo   SUCCESS! Pushed to GitHub and live on Pages!
    echo ===================================================
) else (
    echo [ERROR] Git push encountered an issue. Check your connection / credentials.
)
pause
