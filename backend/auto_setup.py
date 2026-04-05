"""
Auto-Setup Module for Zero-Configuration Databases
Creates and initializes all databases on first run
"""

import sqlite3
import os
from pathlib import Path

DB_DIR = Path("/tmp/sql_studio_databases")
DB_DIR.mkdir(exist_ok=True)

def create_sqlite_main():
    """Create main SQLite database"""
    db_path = DB_DIR / "main.db"
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            age INTEGER,
            department TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product TEXT NOT NULL,
            amount DECIMAL(10, 2),
            status TEXT DEFAULT 'pending',
            order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            price DECIMAL(10, 2),
            stock INTEGER DEFAULT 0
        )
    """)
    
    # Check if data exists
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        # Insert sample data
        users_data = [
            ("John Doe", "john@example.com", 30, "Engineering"),
            ("Jane Smith", "jane@example.com", 25, "Marketing"),
            ("Bob Johnson", "bob@example.com", 35, "Sales"),
            ("Alice Brown", "alice@example.com", 28, "Engineering"),
            ("Charlie Davis", "charlie@example.com", 32, "HR"),
            ("Eva Wilson", "eva@example.com", 27, "Marketing"),
            ("Frank Miller", "frank@example.com", 40, "Sales"),
            ("Grace Lee", "grace@example.com", 29, "Engineering")
        ]
        cursor.executemany("INSERT INTO users (name, email, age, department) VALUES (?, ?, ?, ?)", users_data)
        
        products_data = [
            ("Laptop", "Electronics", 999.99, 50),
            ("Mouse", "Electronics", 29.99, 200),
            ("Keyboard", "Electronics", 79.99, 150),
            ("Monitor", "Electronics", 299.99, 75),
            ("Headphones", "Electronics", 149.99, 100),
            ("Desk Chair", "Furniture", 249.99, 30),
            ("Desk Lamp", "Furniture", 49.99, 80),
            ("Notebook", "Stationery", 5.99, 500)
        ]
        cursor.executemany("INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)", products_data)
        
        orders_data = [
            (1, "Laptop", 999.99, "completed"),
            (1, "Mouse", 29.99, "completed"),
            (2, "Keyboard", 79.99, "pending"),
            (3, "Monitor", 299.99, "completed"),
            (4, "Headphones", 149.99, "shipped"),
            (5, "Desk Chair", 249.99, "completed"),
            (6, "Desk Lamp", 49.99, "pending"),
            (7, "Notebook", 5.99, "completed"),
            (2, "Laptop", 999.99, "shipped"),
            (3, "Headphones", 149.99, "completed")
        ]
        cursor.executemany("INSERT INTO orders (user_id, product, amount, status) VALUES (?, ?, ?, ?)", orders_data)
    
    conn.commit()
    conn.close()
    return str(db_path)

def create_mysql_demo():
    """Create MySQL demo database (using SQLite with MySQL-like data)"""
    db_path = DB_DIR / "mysql_demo.db"
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    
    # E-commerce demo
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS customers (
            customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE,
            phone TEXT,
            country TEXT
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER,
            amount DECIMAL(10, 2),
            transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            payment_method TEXT,
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        )
    """)
    
    # Check if data exists
    cursor.execute("SELECT COUNT(*) FROM customers")
    if cursor.fetchone()[0] == 0:
        customers = [
            ("James", "Anderson", "james.a@email.com", "+1-555-0101", "USA"),
            ("Maria", "Garcia", "maria.g@email.com", "+34-555-0102", "Spain"),
            ("Li", "Wang", "li.w@email.com", "+86-555-0103", "China"),
            ("Emma", "Johnson", "emma.j@email.com", "+44-555-0104", "UK"),
            ("Carlos", "Rodriguez", "carlos.r@email.com", "+52-555-0105", "Mexico")
        ]
        cursor.executemany("INSERT INTO customers (first_name, last_name, email, phone, country) VALUES (?, ?, ?, ?, ?)", customers)
        
        transactions = [
            (1, 599.99, "2024-01-15 10:30:00", "credit_card"),
            (2, 899.50, "2024-01-16 14:20:00", "paypal"),
            (3, 299.00, "2024-01-17 09:15:00", "credit_card"),
            (1, 1299.99, "2024-01-18 16:45:00", "credit_card"),
            (4, 450.75, "2024-01-19 11:30:00", "debit_card"),
            (5, 799.00, "2024-01-20 13:00:00", "paypal")
        ]
        cursor.executemany("INSERT INTO transactions (customer_id, amount, transaction_date, payment_method) VALUES (?, ?, ?, ?)", transactions)
    
    conn.commit()
    conn.close()
    return str(db_path)

def create_postgresql_demo():
    """Create PostgreSQL demo database (using SQLite with PostgreSQL-like data)"""
    db_path = DB_DIR / "postgres_demo.db"
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    
    # Analytics/Reporting demo
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS departments (
            dept_id INTEGER PRIMARY KEY AUTOINCREMENT,
            dept_name TEXT NOT NULL,
            location TEXT,
            budget DECIMAL(12, 2)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS employees (
            emp_id INTEGER PRIMARY KEY AUTOINCREMENT,
            emp_name TEXT NOT NULL,
            dept_id INTEGER,
            salary DECIMAL(10, 2),
            hire_date DATE,
            FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            project_id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_name TEXT NOT NULL,
            dept_id INTEGER,
            start_date DATE,
            end_date DATE,
            budget DECIMAL(12, 2),
            FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
        )
    """)
    
    # Check if data exists
    cursor.execute("SELECT COUNT(*) FROM departments")
    if cursor.fetchone()[0] == 0:
        departments = [
            ("Engineering", "San Francisco", 2500000.00),
            ("Marketing", "New York", 1200000.00),
            ("Sales", "Chicago", 1800000.00),
            ("HR", "Austin", 800000.00)
        ]
        cursor.executemany("INSERT INTO departments (dept_name, location, budget) VALUES (?, ?, ?)", departments)
        
        employees = [
            ("Sarah Connor", 1, 120000.00, "2022-01-15"),
            ("John Smith", 1, 95000.00, "2022-03-20"),
            ("Emily Davis", 2, 75000.00, "2022-02-10"),
            ("Michael Brown", 3, 85000.00, "2022-04-05"),
            ("Lisa Anderson", 4, 70000.00, "2022-05-12"),
            ("David Wilson", 1, 110000.00, "2022-06-18"),
            ("Jennifer Taylor", 2, 80000.00, "2022-07-22"),
            ("Robert Martinez", 3, 90000.00, "2022-08-30")
        ]
        cursor.executemany("INSERT INTO employees (emp_name, dept_id, salary, hire_date) VALUES (?, ?, ?, ?)", employees)
        
        projects = [
            ("Cloud Migration", 1, "2024-01-01", "2024-06-30", 500000.00),
            ("Brand Refresh", 2, "2024-02-01", "2024-05-31", 250000.00),
            ("Sales Automation", 3, "2024-01-15", "2024-07-15", 350000.00),
            ("Recruitment Platform", 4, "2024-03-01", "2024-08-31", 150000.00)
        ]
        cursor.executemany("INSERT INTO projects (project_name, dept_id, start_date, end_date, budget) VALUES (?, ?, ?, ?, ?)", projects)
    
    conn.commit()
    conn.close()
    return str(db_path)

def initialize_all_databases():
    """Initialize all databases on startup"""
    print("🔧 Initializing databases...")
    
    sqlite_path = create_sqlite_main()
    print(f"✓ SQLite ready: {sqlite_path}")
    
    mysql_path = create_mysql_demo()
    print(f"✓ MySQL Demo ready: {mysql_path}")
    
    postgres_path = create_postgresql_demo()
    print(f"✓ PostgreSQL Demo ready: {postgres_path}")
    
    return {
        "sqlite": sqlite_path,
        "mysql": mysql_path,
        "postgresql": postgres_path
    }

if __name__ == "__main__":
    initialize_all_databases()
    print("✅ All databases initialized!")
