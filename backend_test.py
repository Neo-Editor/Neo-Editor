import requests
import sys
import json
from datetime import datetime

class SQLStudioAPITester:
    def __init__(self, base_url="https://sql-exec-win.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")

            self.test_results.append({
                "test": name,
                "success": success,
                "status_code": response.status_code,
                "expected_status": expected_status
            })

            return success, response.json() if success and response.content else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "test": name,
                "success": False,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_sqlite_query_execution(self):
        """Test SQLite query execution"""
        query_data = {
            "database_type": "sqlite",
            "query": "SELECT * FROM users LIMIT 3;",
            "connection_params": {"database": "/tmp/sql_studio_default.db"}
        }
        return self.run_test("SQLite Query Execution", "POST", "query/execute", 200, query_data)

    def test_sqlite_insert_query(self):
        """Test SQLite insert query"""
        query_data = {
            "database_type": "sqlite", 
            "query": "INSERT INTO users (name, email, age, department) VALUES ('Test User', 'test@example.com', 25, 'Testing');",
            "connection_params": {"database": "/tmp/sql_studio_default.db"}
        }
        return self.run_test("SQLite Insert Query", "POST", "query/execute", 200, query_data)

    def test_invalid_query(self):
        """Test invalid SQL query handling"""
        query_data = {
            "database_type": "sqlite",
            "query": "SELECT * FROM nonexistent_table;",
            "connection_params": {"database": "/tmp/sql_studio_default.db"}
        }
        success, response = self.run_test("Invalid Query Handling", "POST", "query/execute", 200, query_data)
        if success and not response.get('success'):
            print("✅ Error handling working correctly")
            return True, response
        return success, response

    def test_query_history(self):
        """Test query history retrieval"""
        return self.run_test("Query History", "GET", "query/history", 200, params={"limit": 10})

    def test_clear_history(self):
        """Test clearing query history"""
        return self.run_test("Clear History", "DELETE", "query/history", 200)

    def test_save_query(self):
        """Test saving a query"""
        save_data = {
            "name": "Test Query",
            "query": "SELECT COUNT(*) FROM users;",
            "database_type": "sqlite",
            "encrypted": False
        }
        return self.run_test("Save Query", "POST", "query/save", 200, save_data)

    def test_save_encrypted_query(self):
        """Test saving an encrypted query"""
        save_data = {
            "name": "Encrypted Test Query",
            "query": "SELECT * FROM orders;",
            "database_type": "sqlite",
            "encrypted": True,
            "password": "testpass123"
        }
        return self.run_test("Save Encrypted Query", "POST", "query/save", 200, save_data)

    def test_get_saved_queries(self):
        """Test retrieving saved queries"""
        return self.run_test("Get Saved Queries", "GET", "query/saved", 200)

    def test_decrypt_query(self):
        """Test decrypting a saved query"""
        # First get saved queries to find an encrypted one
        success, saved_queries = self.test_get_saved_queries()
        if success and saved_queries:
            for query in saved_queries:
                if query.get('encrypted'):
                    decrypt_data = {
                        "query_id": query['id'],
                        "password": "testpass123"
                    }
                    return self.run_test("Decrypt Query", "POST", "query/decrypt", 200, decrypt_data)
        
        print("⚠️  No encrypted queries found to test decryption")
        return True, {}

    def test_debug_functionality(self):
        """Test AI debug functionality"""
        debug_data = {
            "query": "SELECT * FROM nonexistent_table;",
            "error_message": "table nonexistent_table does not exist"
        }
        return self.run_test("Debug Functionality", "POST", "debug", 200, debug_data)

    def test_settings_get(self):
        """Test getting app settings"""
        return self.run_test("Get Settings", "GET", "settings", 200)

    def test_settings_update(self):
        """Test updating app settings"""
        settings_data = {
            "user_id": "default",
            "debug_enabled": True,
            "auto_save_history": True,
            "syntax_highlighting": True,
            "max_history_items": 50
        }
        return self.run_test("Update Settings", "PUT", "settings", 200, settings_data)

    def test_sample_database_creation(self):
        """Test sample database creation"""
        return self.run_test("Sample Database Creation", "GET", "sample-database", 200)

    def test_unsupported_database(self):
        """Test unsupported database type"""
        query_data = {
            "database_type": "unsupported_db",
            "query": "SELECT 1;",
            "connection_params": {}
        }
        return self.run_test("Unsupported Database", "POST", "query/execute", 400, query_data)

def main():
    print("🚀 Starting SQL Studio API Tests...")
    print("=" * 50)
    
    tester = SQLStudioAPITester()
    
    # Run all tests
    test_methods = [
        tester.test_root_endpoint,
        tester.test_sqlite_query_execution,
        tester.test_sqlite_insert_query,
        tester.test_invalid_query,
        tester.test_query_history,
        tester.test_save_query,
        tester.test_save_encrypted_query,
        tester.test_get_saved_queries,
        tester.test_decrypt_query,
        tester.test_debug_functionality,
        tester.test_settings_get,
        tester.test_settings_update,
        tester.test_sample_database_creation,
        tester.test_unsupported_database,
        tester.test_clear_history  # Clear history last
    ]
    
    for test_method in test_methods:
        try:
            test_method()
        except Exception as e:
            print(f"❌ Test {test_method.__name__} failed with exception: {e}")
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Summary:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    # Print failed tests
    failed_tests = [result for result in tester.test_results if not result['success']]
    if failed_tests:
        print(f"\n❌ Failed Tests:")
        for test in failed_tests:
            error_msg = test.get('error', f"Status {test.get('status_code')} != {test.get('expected_status')}")
            print(f"   - {test['test']}: {error_msg}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())