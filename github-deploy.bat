@echo off
REM Quick GitHub Pages Deployment for Auto-Rickshaw VR Simulator

echo.
echo 🛺 GitHub Pages Quick Deploy
echo =============================
echo.

REM Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first:
    echo    https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git found!
echo.

REM Get repository details
set /p username="Enter your GitHub username: "
set /p reponame="Enter repository name (default: auto-rickshaw-vr): "

if "%reponame%"=="" set reponame=auto-rickshaw-vr

echo.
echo 📋 Deployment Summary:
echo ======================
echo Username: %username%
echo Repository: %reponame%
echo URL will be: https://%username%.github.io/%reponame%
echo.

set /p confirm="Continue with deployment? (y/n): "
if /i not "%confirm%"=="y" (
    echo Deployment cancelled.
    pause
    exit /b 0
)

echo.
echo 🚀 Starting deployment...
echo.

REM Initialize git if not already done
if not exist .git (
    echo Initializing Git repository...
    git init
)

REM Add all files
echo Adding files to Git...
git add .

REM Create initial commit
echo Creating commit...
git commit -m "Deploy: Auto-Rickshaw VR Simulator with all features"

REM Set main branch
echo Setting main branch...
git branch -M main

REM Add remote origin
echo Setting remote origin...
git remote remove origin >nul 2>nul
git remote add origin https://github.com/%username%/%reponame%.git

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo 📝 Next Steps:
    echo ==============
    echo 1. Go to: https://github.com/%username%/%reponame%
    echo 2. Click "Settings" tab
    echo 3. Scroll to "Pages" section
    echo 4. Under "Source", select "Deploy from a branch"
    echo 5. Choose "main" branch and "/ (root)" folder
    echo 6. Click "Save"
    echo.
    echo 🌐 Your site will be live at:
    echo    https://%username%.github.io/%reponame%
    echo.
    echo ⏱️  It may take a few minutes to deploy.
) else (
    echo.
    echo ❌ Push failed. Please check:
    echo - Repository exists on GitHub
    echo - You have push permissions
    echo - Correct username/repository name
    echo.
    echo You can create the repository at:
    echo https://github.com/new
)

echo.
pause