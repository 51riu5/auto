@echo off
REM Auto-Rickshaw VR Simulator - Windows Deployment Script

echo.
echo 🛺 Auto-Rickshaw VR Simulator - Deployment Helper
echo =================================================
echo.
echo Choose your deployment method:
echo 1. GitHub Pages (Free, Git-based)
echo 2. Netlify (Free, Drag ^& Drop)
echo 3. Vercel (Free, Professional)
echo 4. Firebase Hosting (Google)
echo 5. Surge.sh (Ultra Simple)
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto github
if "%choice%"=="2" goto netlify
if "%choice%"=="3" goto vercel
if "%choice%"=="4" goto firebase
if "%choice%"=="5" goto surge
goto invalid

:github
echo.
echo 📝 GitHub Pages Deployment Steps:
echo ==================================
echo 1. Create a new repository on GitHub.com
echo 2. Run these commands:
echo.
echo    git init
echo    git add .
echo    git commit -m "Initial commit: Auto-Rickshaw VR Simulator"
echo    git remote add origin https://github.com/YOUR_USERNAME/auto-rickshaw-vr.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Go to GitHub repository → Settings → Pages
echo 4. Select 'Deploy from branch' → main → / (root)
echo 5. Your site will be live at: https://YOUR_USERNAME.github.io/auto-rickshaw-vr
echo.
pause
goto end

:netlify
echo.
echo 🚀 Netlify Deployment:
echo ======================
echo Method 1 - Drag ^& Drop:
echo 1. Go to netlify.com
echo 2. Drag your project folder to the deployment area
echo 3. Get instant live URL!
echo.
echo Method 2 - Git Integration:
echo 1. Push code to GitHub first (see option 1)
echo 2. Go to netlify.com → New site from Git
echo 3. Connect GitHub repository
echo 4. Deploy!
echo.
pause
goto end

:vercel
echo.
echo ⚡ Vercel Deployment:
echo ====================
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo Installing Vercel CLI...
    call npm install -g vercel
    echo.
    echo Running deployment...
    call vercel --prod
) else (
    echo ❌ npm not found. Please install Node.js first.
    echo Or deploy manually:
    echo 1. Install Node.js from nodejs.org
    echo 2. Run: npm install -g vercel
    echo 3. Run: vercel
)
goto end

:firebase
echo.
echo 🔥 Firebase Hosting:
echo ===================
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo Installing Firebase CLI...
    call npm install -g firebase-tools
    echo.
    echo Login to Firebase...
    call firebase login
    echo.
    echo Initializing project...
    call firebase init hosting
    echo.
    echo Deploying...
    call firebase deploy
) else (
    echo ❌ npm not found. Please install Node.js first.
    echo Manual steps:
    echo 1. Install Node.js from nodejs.org
    echo 2. Run: npm install -g firebase-tools
    echo 3. Run: firebase login
    echo 4. Run: firebase init hosting
    echo 5. Run: firebase deploy
)
goto end

:surge
echo.
echo 🌊 Surge.sh Deployment:
echo =======================
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo Installing Surge...
    call npm install -g surge
    echo.
    echo Deploying to Surge...
    call surge . auto-rickshaw-vr.surge.sh
) else (
    echo ❌ npm not found. Please install Node.js first.
    echo Manual steps:
    echo 1. Install Node.js from nodejs.org
    echo 2. Run: npm install -g surge
    echo 3. Run: surge
)
goto end

:invalid
echo ❌ Invalid choice. Please run the script again.
pause
exit /b 1

:end
echo.
echo 🎉 Deployment process started!
echo.
echo 📋 Post-Deployment Checklist:
echo ==============================
echo ✅ Test VR mode works
echo ✅ Test AI chat functions  
echo ✅ Test voice input
echo ✅ Test mobile responsiveness
echo ✅ Test all game features
echo ✅ Configure API keys (users will need their own)
echo.
echo 📱 Share your deployed app:
echo ==========================  
echo - Social media (Twitter, Facebook, LinkedIn)
echo - Reddit communities (r/WebVR, r/gamedev, r/Kerala)
echo - Product Hunt launch
echo - Indie game showcases
echo.
echo 🛺 Your Kerala Auto-Rickshaw VR experience is ready to go live! ✨
pause