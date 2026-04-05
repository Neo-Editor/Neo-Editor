# SQL Studio - Desktop SQL Client

## 🚀 Features

- **Multi-Database Support**: SQLite, MySQL, PostgreSQL, SQL Server
- **AI-Powered Debugging**: Local LLM for intelligent query suggestions
- **Encrypted File Storage**: Save queries with password protection
- **Query History**: Track all executed queries
- **Syntax Highlighting**: Beautiful SQL editor with syntax highlighting
- **Dark/Light Mode**: Toggle between themes
- **Cross-Platform**: Works on Windows, Linux, and macOS

## 💻 Web App Usage

### Running the Web Version

1. **Backend**:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

2. **Frontend**:
```bash
cd frontend
yarn install
yarn start
```

3. Open `http://localhost:3000` in your browser

## 📦 Electron Desktop App

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.11+
- pip

### Building the Desktop App

1. **Install Python Dependencies**:
```bash
cd backend
pip install -r requirements.txt
cd ..
```

2. **Build Frontend**:
```bash
cd frontend
yarn install
yarn build
cp -r build ../
cd ..
```

3. **Install Electron Dependencies**:
```bash
cp electron-package.json package.json
npm install
```

4. **Run in Development**:
```bash
# Terminal 1: Start frontend dev server
cd frontend && yarn start

# Terminal 2: Start Electron
npm run electron-dev
```

5. **Build Windows EXE**:
```bash
npm run electron-pack
```

The Windows installer will be in the `dist/` folder.

### Building for All Platforms

```bash
npm run electron-pack-all
```

This creates:
- Windows: `dist/SQL Studio Setup 1.0.0.exe`
- Linux: `dist/SQL-Studio-1.0.0.AppImage`
- macOS: `dist/SQL Studio-1.0.0.dmg`

## 📚 Database Setup

### SQLite (Default)

Click "Create Sample Database" in the Database panel to create a test database with sample data.

### MySQL

1. Install MySQL Server
2. Create a database
3. In SQL Studio, select MySQL and enter connection details:
   - Host: `localhost`
   - Port: `3306`
   - Username: your MySQL username
   - Password: your MySQL password
   - Database: your database name

### PostgreSQL

1. Install PostgreSQL
2. Create a database
3. In SQL Studio, select PostgreSQL and enter connection details:
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: your PostgreSQL password
   - Database: your database name

### SQL Server

1. Install SQL Server
2. Install ODBC Driver 17 for SQL Server
3. In SQL Studio, select SQL Server and enter connection details:
   - Host: `localhost`
   - Port: `1433`
   - Username: your SQL Server username
   - Password: your SQL Server password
   - Database: your database name

## 🔑 Features Guide

### Query History

- All executed queries are automatically saved
- Click any history item to load it in the editor
- Clear history with the trash icon

### Saved Queries (Files)

- Save frequently used queries
- **Encrypted Save**: Check "Encrypt with password" to secure sensitive queries
- Click "Load" to open a saved query
- Encrypted queries require password to open

### AI Debug

- Local AI model provides intelligent suggestions
- Analyzes syntax errors and provides fixes
- Suggests query improvements
- Works offline

### Settings

- Toggle AI Debug Assistant on/off
- Enable/disable auto-save history
- Enable/disable syntax highlighting

## 🐛 Troubleshooting

### Backend not starting

- Ensure Python dependencies are installed: `pip install -r backend/requirements.txt`
- Check if port 8001 is available

### Database connection failed

- Verify database credentials
- Ensure database server is running
- Check firewall settings

### Electron app not building

- Ensure frontend is built: `cd frontend && yarn build`
- Check that `build/` folder exists
- Install electron-builder: `npm install electron-builder --save-dev`

## 📝 Sample Queries

```sql
-- Create a table
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    salary DECIMAL(10, 2),
    hire_date DATE
);

-- Insert data
INSERT INTO employees (name, email, salary, hire_date)
VALUES ('John Doe', 'john@example.com', 75000.00, '2024-01-15');

-- Query with JOIN
SELECT u.name, o.product, o.amount
FROM users u
JOIN orders o ON u.id = o.user_id
ORDER BY o.amount DESC;

-- Aggregation
SELECT 
    COUNT(*) as total_orders,
    SUM(amount) as total_revenue,
    AVG(amount) as avg_order_value
FROM orders;
```

## 🔐 Security Notes

- Encrypted queries use Fernet (symmetric encryption)
- Passwords are hashed with SHA256 before key derivation
- Connection credentials are stored in memory only
- No data is sent to external servers

## 🚀 Tech Stack

- **Frontend**: React, TailwindCSS, Shadcn/UI, Phosphor Icons
- **Backend**: FastAPI, Python
- **Database Connectors**: sqlite3, psycopg2, pymysql, pyodbc
- **AI**: Transformers, PyTorch (local model)
- **Desktop**: Electron
- **Encryption**: cryptography (Fernet)

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.
