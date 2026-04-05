# SQL Studio - Desktop Installation Guide

## 🖥️ Desktop Application

SQL Studio can run as a standalone desktop application on Windows 11/12 and Linux Ubuntu using Electron.

---

## 📦 Installation Methods

### Method 1: Pre-built Installers (Recommended)

**Windows 11/12**:lp
1. Download `SQL-Studio-Setup-1.0.0.exe`pl
2. Run the installer
3. Follow the installation wizard
4. Launch SQL Studio from Start Menu

**Linux Ubuntu**:
1. Download `SQL-Studio-1.0.0.AppImage`
2. Make it executable: `chmod +x SQL-Studio-1.0.0.AppImage`
3. Run: `./SQL-Studio-1.0.0.AppImage`

---

### Method 2: Build from Source

#### Prerequisites

**All Platforms**:
- Node.js 18+ ([Download](https://nodejs.org))
- Python 3.11+ ([Download](https://python.org))
- Git

**Windows Additional**:
- Windows Build Tools: `npm install --global windows-build-tools`

**Linux Additional**:
- Build tools: `sudo apt-get install build-essential`

---

#### Build Steps

**1. Clone the Repository** (or download source code)
```bash
cd /path/to/sql-studio
```

**2. Install Python Dependencies**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

**3. Build Frontend**
```bash
cd frontend
npm install
# or: yarn install

npm run build
# or: yarn build

cd ..
```

**4. Copy Build Files**
```bash
cp -r frontend/build .
```

**5. Setup Electron**
```bash
cp electron-package.json package.json
npm install
```

**6. Build Desktop App**

**For Windows**:
```bash
npm run electron-pack
```
Output: `dist/SQL Studio Setup 1.0.0.exe`

**For Linux**:
```bash
npm run electron-pack-linux
```
Output: `dist/SQL-Studio-1.0.0.AppImage`

**For Both**:
```bash
npm run electron-pack-all
```

---

## 🚀 Running the Desktop App

### Development Mode

**Start Backend**:
```bash
cd backend
python -m uvicorn server:app --host 127.0.0.1 --port 8001
```

**Start Frontend (separate terminal)**:
```bash
cd frontend
npm start
```

**Start Electron (separate terminal)**:
```bash
npm run electron-dev
```

### Production Mode

The installed app includes:
- **Built-in Backend**: Python server starts automatically
- **Built-in Database**: SQLite pre-configured
- **All Features**: Export, Schema, Snippets, Stats, AI Debug

**Default Settings**:
- Backend: `http://127.0.0.1:8001`
- Database: Auto-created in app data directory
- Port: 8001 (automatically used)

---

## 🔧 Manual Setup (Alternative)

If you prefer to run without building:

**1. Install Dependencies**
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

**2. Create Production Build**
```bash
cd frontend
npm run build
```

**3. Serve with Electron**
```bash
cd ..
cp electron-package.json package.json
npm install electron
npm run electron
```

---

## 📁 File Structure for Desktop

```
sql-studio/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env
├── build/          # Frontend build
│   ├── index.html
│   └── static/
├── electron-main.js
├── package.json
└── node_modules/
```

---

## ⚙️ Configuration

### Backend Configuration

Edit `backend/.env`:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=sql_studio
CORS_ORIGINS=*
```

### Frontend Configuration

The desktop app automatically connects to `http://127.0.0.1:8001`.

To change the backend URL, edit `frontend/.env` before building:
```env
REACT_APP_BACKEND_URL=http://127.0.0.1:8001
```

---

## 🐛 Troubleshooting

### Windows Issues

**1. "Python not found"**
- Install Python from python.org
- Add Python to PATH during installation
- Verify: `python --version`

**2. "Module not found"**
```bash
cd backend
pip install -r requirements.txt
```

**3. "Port 8001 already in use"**
- Stop any process using port 8001
- Or change port in `electron-main.js` (line 47)

### Linux Issues

**1. "Permission denied"**
```bash
chmod +x SQL-Studio-1.0.0.AppImage
```

**2. "libfuse.so.2 not found"** (Ubuntu 22.04+)
```bash
sudo apt install libfuse2
```

**3. "Python command not found"**
```bash
sudo apt install python3 python3-pip
```

### Common Issues

**1. Backend won't start**
- Check Python version: `python --version` (need 3.11+)
- Install dependencies: `pip install -r backend/requirements.txt`
- Check logs in app console (Ctrl+Shift+I)

**2. Database errors**
- MongoDB not needed for SQLite (default)
- SQLite database auto-created in app directory
- Check write permissions

**3. App won't launch**
- Check if all dependencies installed
- Try running in development mode first
- Check console for errors (Ctrl+Shift+I)

---

## 📊 System Requirements

**Minimum**:
- OS: Windows 10/11, Ubuntu 20.04+
- RAM: 4 GB
- Disk: 500 MB free space
- CPU: Dual-core 2.0 GHz

**Recommended**:
- OS: Windows 11, Ubuntu 22.04+
- RAM: 8 GB
- Disk: 1 GB free space
- CPU: Quad-core 2.5 GHz

---

## 🔄 Updates

The desktop app does not auto-update. To update:

1. Download the latest installer
2. Run installer (Windows) or replace AppImage (Linux)
3. Your saved queries and settings are preserved

**Settings Location**:
- Windows: `C:\Users\YourName\AppData\Roaming\sql-studio-desktop`
- Linux: `~/.config/sql-studio-desktop`

---

## 🔐 Security Notes

1. **Local Only**: Backend runs on localhost (127.0.0.1)
2. **No External Access**: Not accessible from network
3. **Encrypted Storage**: Queries can be password-protected
4. **Local AI**: Debugging runs completely offline
5. **No Telemetry**: No data sent to external servers

---

## 📚 Additional Resources

- **User Guide**: `/app/README.md`
- **Professional Features**: `/app/PROFESSIONAL_FEATURES.md`
- **Production Guide**: `/app/PRODUCTION_READY.md`
- **API Documentation**: Backend API available at `http://127.0.0.1:8001/docs`

---

## 💡 Tips

1. **First Launch**: May take 3-5 seconds while backend starts
2. **Sample Database**: Auto-created with users, orders, products tables
3. **Keyboard Shortcuts**: 
   - Ctrl+Enter: Run Query
   - Ctrl+K: Format Query
   - Ctrl+E: Export Results
   - Ctrl+S: Save Query
4. **Performance**: Close other SQL tools to avoid port conflicts

---

## 🎯 Quick Start Guide

### After Installation

1. **Launch SQL Studio** from Start Menu (Windows) or Application Menu (Linux)
2. **Wait 3 seconds** for backend to initialize
3. **Run sample query**: Click "Run" button with default query
4. **Explore features**:
   - Schema: Browse database structure
   - Snippets: Use pre-built query templates
   - Stats: View query analytics
   - Export: Save results as CSV/JSON/Excel/SQL

### First Query

```sql
-- View all users
SELECT * FROM users;

-- Join orders with users
SELECT u.name, u.email, o.product, o.amount
FROM users u
JOIN orders o ON u.id = o.user_id
LIMIT 10;
```

---

## 📞 Support

For issues or questions:

1. Check Troubleshooting section above
2. Review logs: View → Toggle Developer Tools (Ctrl+Shift+I)
3. Check GitHub Issues
4. Verify all dependencies installed

---

**SQL Studio Desktop** - Professional SQL Client for Windows & Linux
Version 1.0.0 | Build Date: 2026-04-05
