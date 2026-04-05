"""
Neo Editor API Tests
Tests for SQL execution, history, snippets, stats, debug, and export endpoints
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndRoot:
    """Basic API health checks"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "status" in data
        assert data["status"] == "running"
        print(f"✓ API root: {data}")


class TestQueryExecution:
    """Query execution tests for all database types"""
    
    def test_execute_sqlite_select(self):
        """Test SQLite SELECT query execution"""
        response = requests.post(f"{BASE_URL}/api/query/execute", json={
            "database_type": "sqlite",
            "query": "SELECT * FROM users LIMIT 5;",
            "connection_params": {"database": "embedded"}
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "columns" in data
        assert "rows" in data
        assert len(data["rows"]) > 0
        print(f"✓ SQLite SELECT: {len(data['rows'])} rows returned")
    
    def test_execute_query_with_comments(self):
        """Test query execution with SQL comments (-- lines before SELECT)"""
        query_with_comments = """-- This is a comment
-- Another comment line
-- Welcome to Neo Editor!
SELECT * FROM users LIMIT 3;"""
        
        response = requests.post(f"{BASE_URL}/api/query/execute", json={
            "database_type": "sqlite",
            "query": query_with_comments,
            "connection_params": {"database": "embedded"}
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True, f"Query with comments failed: {data.get('error')}"
        assert "rows" in data
        assert len(data["rows"]) > 0
        print(f"✓ Query with comments: {len(data['rows'])} rows returned")
    
    def test_execute_mysql_select(self):
        """Test MySQL SELECT query execution (uses embedded SQLite demo)"""
        response = requests.post(f"{BASE_URL}/api/query/execute", json={
            "database_type": "mysql",
            "query": "SELECT * FROM customers;",
            "connection_params": {}
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True, f"MySQL query failed: {data.get('error')}"
        assert "columns" in data
        assert "rows" in data
        assert len(data["rows"]) > 0
        print(f"✓ MySQL SELECT (demo): {len(data['rows'])} rows returned")
    
    def test_execute_postgresql_select(self):
        """Test PostgreSQL SELECT query execution (uses embedded SQLite demo)"""
        response = requests.post(f"{BASE_URL}/api/query/execute", json={
            "database_type": "postgresql",
            "query": "SELECT * FROM employees;",
            "connection_params": {}
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True, f"PostgreSQL query failed: {data.get('error')}"
        assert "columns" in data
        assert "rows" in data
        assert len(data["rows"]) > 0
        print(f"✓ PostgreSQL SELECT (demo): {len(data['rows'])} rows returned")
    
    def test_execute_invalid_query(self):
        """Test error handling for invalid SQL"""
        response = requests.post(f"{BASE_URL}/api/query/execute", json={
            "database_type": "sqlite",
            "query": "SELECT * FROM nonexistent_table;",
            "connection_params": {"database": "embedded"}
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == False
        assert "error" in data
        print(f"✓ Invalid query error handling: {data['error'][:50]}...")


class TestQueryHistory:
    """Query history endpoint tests"""
    
    def test_get_history(self):
        """Test GET /api/query/history"""
        response = requests.get(f"{BASE_URL}/api/query/history")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ History: {len(data)} entries")
    
    def test_history_contains_recent_queries(self):
        """Test that history contains recently executed queries"""
        # First execute a query
        requests.post(f"{BASE_URL}/api/query/execute", json={
            "database_type": "sqlite",
            "query": "SELECT 'TEST_HISTORY_CHECK' as test;",
            "connection_params": {"database": "embedded"}
        })
        
        # Then check history
        response = requests.get(f"{BASE_URL}/api/query/history?limit=10")
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        # Check that history entries have required fields
        if data:
            entry = data[0]
            assert "query" in entry
            assert "database_type" in entry
            assert "success" in entry
        print(f"✓ History contains recent queries")


class TestSnippets:
    """SQL snippets endpoint tests"""
    
    def test_get_snippets(self):
        """Test GET /api/snippets"""
        response = requests.get(f"{BASE_URL}/api/snippets")
        assert response.status_code == 200
        data = response.json()
        assert "snippets" in data
        assert isinstance(data["snippets"], list)
        assert len(data["snippets"]) > 0
        
        # Check snippet structure
        snippet = data["snippets"][0]
        assert "name" in snippet
        assert "description" in snippet
        assert "query" in snippet
        print(f"✓ Snippets: {len(data['snippets'])} templates available")


class TestStats:
    """Query statistics endpoint tests"""
    
    def test_get_stats(self):
        """Test GET /api/stats"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        data = response.json()
        
        assert "total_queries" in data
        assert "successful_queries" in data
        assert "failed_queries" in data
        assert "success_rate" in data
        assert "database_distribution" in data
        
        print(f"✓ Stats: {data['total_queries']} total queries, {data['success_rate']}% success rate")


class TestDebug:
    """AI debug endpoint tests"""
    
    def test_debug_query(self):
        """Test POST /api/debug"""
        response = requests.post(f"{BASE_URL}/api/debug", json={
            "query": "SELECT * FROM users WHERE",
            "error_message": "syntax error near WHERE"
        })
        assert response.status_code == 200
        data = response.json()
        
        assert "suggestions" in data
        assert isinstance(data["suggestions"], list)
        assert len(data["suggestions"]) > 0
        print(f"✓ Debug: {len(data['suggestions'])} suggestions returned")
    
    def test_debug_without_error(self):
        """Test debug endpoint without error message"""
        response = requests.post(f"{BASE_URL}/api/debug", json={
            "query": "SELECT FROM users"
        })
        assert response.status_code == 200
        data = response.json()
        assert "suggestions" in data
        print(f"✓ Debug without error: {len(data['suggestions'])} suggestions")


class TestExport:
    """Export functionality tests"""
    
    def test_export_csv(self):
        """Test CSV export"""
        response = requests.post(f"{BASE_URL}/api/export", json={
            "format": "csv",
            "data": {
                "columns": ["id", "name", "email"],
                "rows": [[1, "John", "john@test.com"], [2, "Jane", "jane@test.com"]]
            },
            "filename": "test_export"
        })
        assert response.status_code == 200
        data = response.json()
        assert "content" in data
        assert "filename" in data
        assert data["filename"].endswith(".csv")
        print(f"✓ CSV export: {data['filename']}")
    
    def test_export_json(self):
        """Test JSON export"""
        response = requests.post(f"{BASE_URL}/api/export", json={
            "format": "json",
            "data": {
                "columns": ["id", "name"],
                "rows": [[1, "Test"]]
            },
            "filename": "test_json"
        })
        assert response.status_code == 200
        data = response.json()
        assert "content" in data
        assert data["filename"].endswith(".json")
        print(f"✓ JSON export: {data['filename']}")
    
    def test_export_excel(self):
        """Test Excel export"""
        response = requests.post(f"{BASE_URL}/api/export", json={
            "format": "excel",
            "data": {
                "columns": ["id", "name"],
                "rows": [[1, "Test"]]
            },
            "filename": "test_excel"
        })
        assert response.status_code == 200
        data = response.json()
        assert "content" in data
        assert data["filename"].endswith(".xlsx")
        assert data.get("encoding") == "base64"
        print(f"✓ Excel export: {data['filename']}")


class TestSettings:
    """Settings endpoint tests"""
    
    def test_get_settings(self):
        """Test GET /api/settings"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        
        assert "debug_enabled" in data
        assert "auto_save_history" in data
        assert "syntax_highlighting" in data
        print(f"✓ Settings retrieved: debug={data['debug_enabled']}")


class TestFormatQuery:
    """Query formatting tests"""
    
    def test_format_query(self):
        """Test POST /api/format-query"""
        response = requests.post(f"{BASE_URL}/api/format-query", json={
            "query": "select * from users where id=1"
        })
        assert response.status_code == 200
        data = response.json()
        assert "formatted_query" in data
        # Check that keywords are uppercased
        assert "SELECT" in data["formatted_query"]
        print(f"✓ Query formatted successfully")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
