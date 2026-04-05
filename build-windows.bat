@echo off
REM SQL Studio - Windows Build Script

echo =========================================
echo SQL Studio Desktop - Windows Build
echo =========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Python is not installed  
    echo Download from: https://python.org
    pause
    exit /b 1
)

echo [OK] Node.js found
echo [OK] Python found
echo.

REM Step 1: Install Python dependencies
echo Step 1: Installing Python dependencies...
cd backend
pip install -r requirements.txt --quiet
cd ..
echo [OK] Python dependencies installed
echo.

REM Step 2: Install frontend dependencies
echo Step 2: Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo [OK] Frontend dependencies installed
echo.

REM Step 3: Build frontend
echo Step 3: Building frontend...
cd frontend
call npm run build
cd ..
echo [OK] Frontend built
echo.

REM Step 4: Copy build
echo Step 4: Copying build files...
xcopy /E /I /Y frontend\build build
echo [OK] Build copied
echo.

REM Step 5: Setup Electron
echo Step 5: Setting up Electron...
copy electron-package.json package.json
call npm install
echo [OK] Electron ready
echo.

REM Step 6: Build Windows installer
echo Step 6: Building Windows installer...
call npm run electron-pack
echo.

REM Check if build succeeded
if exist "dist\SQL Studio Setup 1.0.0.exe" (
    echo =========================================
    echo Build Complete!
    echo =========================================
    echo.
    echo Windows Installer: dist\SQL Studio Setup 1.0.0.exe
    echo.
    echo You can now distribute the installer to users.
    echo.
) else (
    echo =========================================
    echo Build Failed
    echo =========================================
    echo.
    echo Please check the error messages above.
    echo.
)

pause
