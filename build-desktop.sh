#!/bin/bash

# SQL Studio - Complete Build Script for Windows & Linux
# This script builds desktop installers for all platforms

set -e

echo "========================================="
echo "SQL Studio Desktop - Complete Build"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"
echo -e "${GREEN}✓ Python found: $(python3 --version)${NC}"
echo ""

# Step 2: Install backend dependencies
echo -e "${BLUE}Step 2: Installing Python dependencies...${NC}"
cd backend
pip3 install -r requirements.txt --quiet
cd ..
echo -e "${GREEN}✓ Python dependencies installed${NC}"
echo ""

# Step 3: Install frontend dependencies
echo -e "${BLUE}Step 3: Installing frontend dependencies...${NC}"
cd frontend
if command -v yarn &> /dev/null; then
    yarn install --silent
else
    npm install --silent
fi
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

# Step 4: Build frontend
echo -e "${BLUE}Step 4: Building frontend production bundle...${NC}"
if command -v yarn &> /dev/null; then
    yarn build
else
    npm run build
fi
cd ..
echo -e "${GREEN}✓ Frontend build complete${NC}"
echo ""

# Step 5: Copy build files
echo -e "${BLUE}Step 5: Preparing build directory...${NC}"
cp -r frontend/build .
echo -e "${GREEN}✓ Build files copied${NC}"
echo ""

# Step 6: Setup Electron
echo -e "${BLUE}Step 6: Setting up Electron...${NC}"
cp electron-package.json package.json
npm install --silent
echo -e "${GREEN}✓ Electron setup complete${NC}"
echo ""

# Step 7: Build packages
echo -e "${BLUE}Step 7: Building desktop packages...${NC}"
echo ""

# Create dist directory
mkdir -p dist

# Build for Windows
echo -e "${BLUE}Building Windows installer...${NC}"
npm run electron-pack 2>&1 | grep -E "(packaging|building|ERROR)" || true
if [ -f "dist/SQL Studio Setup 1.0.0.exe" ]; then
    echo -e "${GREEN}✓ Windows installer created: dist/SQL Studio Setup 1.0.0.exe${NC}"
else
    echo -e "${RED}⚠ Windows build failed (may require Windows OS)${NC}"
fi
echo ""

# Build for Linux
echo -e "${BLUE}Building Linux AppImage...${NC}"
npx electron-builder --linux appimage 2>&1 | grep -E "(packaging|building|ERROR)" || true
if [ -f "dist/SQL Studio-1.0.0.AppImage" ]; then
    echo -e "${GREEN}✓ Linux AppImage created: dist/SQL Studio-1.0.0.AppImage${NC}"
else
    echo -e "${RED}⚠ Linux build may have issues${NC}"
fi
echo ""

# Step 8: Create portable packages
echo -e "${BLUE}Step 8: Creating portable packages...${NC}"

# Create Windows portable
if [ -d "dist/win-unpacked" ]; then
    cd dist
    zip -r "SQL-Studio-Windows-Portable.zip" win-unpacked/ > /dev/null
    cd ..
    echo -e "${GREEN}✓ Windows portable created: dist/SQL-Studio-Windows-Portable.zip${NC}"
fi

# Create Linux portable
if [ -d "dist/linux-unpacked" ]; then
    cd dist
    tar -czf "SQL-Studio-Linux-Portable.tar.gz" linux-unpacked/
    cd ..
    echo -e "${GREEN}✓ Linux portable created: dist/SQL-Studio-Linux-Portable.tar.gz${NC}"
fi
echo ""

# Step 9: Summary
echo "========================================="
echo -e "${GREEN}Build Complete!${NC}"
echo "========================================="
echo ""
echo "📦 Generated Files:"
ls -lh dist/ 2>/dev/null | grep -E "\.(exe|AppImage|zip|tar\.gz)$" || echo "No dist files found"
echo ""
echo "📚 Installation Guides:"
echo "  - DESKTOP_INSTALLATION.md - Complete installation guide"
echo "  - README.md - User guide"
echo "  - PROFESSIONAL_FEATURES.md - Feature documentation"
echo ""
echo "🚀 Next Steps:"
echo "  1. Test the builds on target platforms"
echo "  2. Distribute installers to users"
echo "  3. Provide installation guide"
echo ""
echo "========================================="
