@echo off
echo ========================================
echo 🚀 COLLEGE CARPOOLING - GIT PUSH SCRIPT
echo ========================================
echo.
echo This script will push your code to GitHub!
echo.
echo IMPORTANT: Make sure you've created the GitHub repository first.
echo If not, go to https://github.com/new and create it now.
echo.
echo Repository details:
echo - Name: college-carpooling (or college_carpoling)
echo - Make it PUBLIC
echo - DON'T initialize with README/gitignore
echo.
set /p repo_url="Enter your GitHub repository URL: "
echo.
if "%repo_url%"=="" (
    echo ❌ No URL provided. Using default...
    set repo_url=https://github.com/Aksh-thakran/college_carpoling.git
    echo Using: %repo_url%
)
echo.
echo 🔗 Adding remote origin...
git remote add origin "%repo_url%" 2>nul
if errorlevel 1 (
    echo Remote already exists, updating URL...
    git remote set-url origin "%repo_url%"
)
echo.
echo 📤 Pushing to GitHub...
git push -u origin main
if errorlevel 1 (
    echo ❌ Push failed! Please check:
    echo - Repository URL is correct
    echo - Repository exists and is accessible
    echo - You have push permissions
    echo.
    echo You can try manually with:
    echo git push -u origin main
    echo.
    pause
    exit /b 1
)
echo.
echo ✅ SUCCESS! Your code is now on GitHub!
echo.
echo 🌐 Repository: %repo_url%
echo.
echo 🚀 NEXT STEPS FOR RENDER DEPLOYMENT:
echo ===================================
echo 1. Go to https://render.com
echo 2. Sign in or create account
echo 3. Click "New" → "Web Service"
echo 4. Connect your GitHub account
echo 5. Select "college-carpooling" repository
echo 6. Render will auto-configure from render.yaml
echo 7. Click "Create Web Service"
echo.
echo ⏱️  Deployment takes 2-5 minutes
echo 🌍 Your app will be live worldwide!
echo.
pause