# SQL Studio - Desktop SQL Client for Windows 

## 🚀 Features

✅ **Ready to Use - Zero Setup Required!**
- Pre-configured SQLite database with sample data
- No database installation needed
- Just install and start querying

✅ **Multi-Database Support**
- SQLite (default, no setup)
- MySQL
- PostgreSQL  
- SQL Server

✅ **AI-Powered Debugging**
- Local LLM for intelligent query suggestions
- Automatic error detection and fixes
- Works completely offline

✅ **Advanced Features**
- 📝 Syntax highlighting for SQL
- 💾 Save queries with password encryption
- 📊 Query history tracking
- 🔄 Dark/Light mode toggle
- ⚙️ Customizable settings

## 💻 Web App (Current Preview)

The app is currently running as a web application. You can access it at:
**https://sql-exec-win.preview.emergentagent.com**

### Quick Start (Web Version)

1. Open the URL above
2. The database is already set up with sample data!
3. Click the **Run** button to execute the default query
4. Try these sample queries:
   ```sql
   -- View all users
   SELECT * FROM users;
   
   -- View orders with customer details
   SELECT u.name, u.email, o.product, o.amount, o.status
   FROM users u
   JOIN orders o ON u.id = o.user_id
   ORDER BY o.order_date DESC;
   
   -- Get total sales by department
   SELECT 
       u.department,
       COUNT(o.id) as total_orders,
       SUM(o.amount) as total_revenue
   FROM users u
   JOIN orders o ON u.id = o.user_id
   WHERE o.status = 'completed'
   GROUP BY u.department
   ORDER BY total_revenue DESC;
   ```

## 📦 Desktop App (Windows EXE)

### Prerequisites
- Windows 10 or 11
- No other installation required!

### Building the Windows EXE

Follow the instructions in `/app/README_ELECTRON.md` for detailed Electron packaging steps.

**Quick Build Steps:**

1. **Build Frontend:**
   ```bash
   cd /app/frontend
   yarn build
   cp -r build ../
   ```

2. **Install Electron:**
   ```bash
   cd /app
   cp electron-package.json package.json
   npm install
   ```

3. **Create Windows EXE:**
   ```bash
   npm run electron-pack
   ```

The installer will be created in `/app/dist/SQL Studio Setup 1.0.0.exe`

## 📚 Sample Database

The app comes with a pre-loaded sample database containing:

### Tables:
- **users** - 8 sample users with departments
- **orders** - Order history with status tracking
- **products** - Product catalog with inventory

### Sample Data Preview:
```
Users: John Doe, Jane Smith, Bob Johnson, Alice Brown, etc.
Departments: Engineering, Marketing, Sales, HR
Products: Laptop, Mouse, Keyboard, Monitor, Headphones, etc.
```

## 🎯 Key Features Explained

### 1. **History Panel**
- Automatically saves all executed queries
- Click any query to load it back into the editor
- Clear history with one click

### 2. **Files Panel (Save Queries)**
- Save frequently used queries
- **Encrypted Save**: Protect sensitive queries with password
- Organize your SQL snippets

### 3. **Database Panel**
- Switch between different database types
- Configure connection parameters
- Create additional sample databases

### 4. **AI Debug Panel**
- Click "Debug Current Query" for AI-powered suggestions
- Get intelligent error fixes
- Improve query performance

### 5. **Settings Panel**
- Toggle AI Debug Assistant
- Enable/disable auto-save history
- Configure syntax highlighting
- Customize your experience

## 🔧 Technical Stack

**Frontend:**
- React 19
- TailwindCSS
- Shadcn/UI Components
- Phosphor Icons
- Prism.js (syntax highlighting)

**Backend:**
- FastAPI (Python)
- SQLite, PostgreSQL, MySQL, SQL Server support
- Motor (MongoDB for app data)
- Transformers (Local AI model)
- Cryptography (Fernet encryption)

**Desktop:**
- Electron (for Windows/Mac/Linux packaging)

## 🔒 Security & Privacy

- **Encrypted Storage**: Queries can be saved with password protection
- **Local AI**: Debugging runs completely offline
- **No Data Sharing**: All queries and data stay on your machine
- **Secure Connections**: Database credentials stored in memory only

## 🎨 Design Features

- **Control Room Grid Layout**: Professional, technical interface
- **Sharp, Precise Design**: 1px borders, minimal shadows
- **Custom Color System**: Carefully crafted dark/light themes
- **Monospace Fonts**: JetBrains Mono, Source Code Pro
- **Responsive**: Works on desktop and tablet sizes

## 📖 Usage Tips

### Running Queries
- Write one SQL statement at a time
- Click **Run** or press Ctrl+Enter
- Use **Refresh** to clear results

### Switching Databases
1. Click **Database** in sidebar
2. Select your database type
3. Enter connection details (if not SQLite)
4. Click "Save & Connect"

### Saving Queries
1. Click **Files** in sidebar
2. Click "Save Current"
3. Enter a name
4. Optionally enable password encryption
5. Click "Save"

### Using AI Debug
1. Write or paste your query
2. Click **Debug** in sidebar
3. Click "Debug Current Query"
4. Review suggestions and apply fixes

## 🚀 Next Steps

**Potential Enhancements:**
- Query result export (CSV, JSON, Excel)
- Visual query builder
- Database schema visualization
- Multiple query tabs
- Cloud sync for saved queries
- Team collaboration features

## 📄 License

MIT License - Free for personal and commercial use

## 🙋 Support

For issues or questions:
1. Check the Settings panel for configuration
2. Review sample queries in the Database panel
3. Use AI Debug for query help

---

**Made with ❤️ using Emergent Agent**
