import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Gear, Database } from '@phosphor-icons/react';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import DatabaseConfigDialog from './DatabaseConfigDialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DatabasePanel = ({ selectedDatabase, onDatabaseChange, onConfigChange }) => {
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [tempConfig, setTempConfig] = useState({});
  const [sampleDbCreated, setSampleDbCreated] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const databases = [
    { value: 'sqlite', label: 'SQLite', description: '✅ Embedded - E-commerce sample data', setup: 'embedded' },
    { value: 'mysql', label: 'MySQL', description: '✅ Embedded - Customer transactions data', setup: 'embedded' },
    { value: 'postgresql', label: 'PostgreSQL', description: '✅ Embedded - Employee analytics data', setup: 'embedded' },
    { value: 'sqlserver', label: 'SQL Server', description: '⚠️ Windows only - Requires installation', setup: 'required' }
  ];

  const createSampleDatabase = async () => {
    try {
      const response = await axios.get(`${API}/sample-database`);
      alert(`Sample database created!\n\nPath: ${response.data.database_path}\n\nTables: users, orders, products\n\nTry these queries:\n- SELECT * FROM users;\n- SELECT * FROM orders;\n- SELECT * FROM products;`);
      setSampleDbCreated(true);
      onConfigChange({ database: response.data.database_path });
    } catch (error) {
      console.error('Failed to create sample database:', error);
      alert('Failed to create sample database');
    }
  };

  const selectDatabase = (db) => {
    onDatabaseChange(db);
    // All databases except SQL Server are embedded and ready
    if (db === 'sqlserver') {
      setTempConfig({});
      setShowConfigDialog(true);
    } else {
      // Use embedded database
      onConfigChange({ database: 'embedded' });
    }
  };

  const saveConfig = () => {
    onConfigChange(tempConfig);
    setShowConfigDialog(false);
  };

  return (
    <div className="flex flex-col h-full" data-testid="database-panel">
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg mb-2">Database Configuration</h2>
        <p className="text-xs text-secondary">
          Select and configure your database connection
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {databases.map((db) => (
            <button
              key={db.value}
              onClick={() => selectDatabase(db.value)}
              data-testid={`select-${db.value}-button`}
              className={`w-full text-left p-4 border transition-colors ${
                selectedDatabase === db.value
                  ? 'border-accent-primary bg-background'
                  : 'border-border hover:bg-background'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Database size={20} weight={selectedDatabase === db.value ? 'fill' : 'regular'} />
                <h3 className="font-medium">{db.label}</h3>
                {selectedDatabase === db.value && (
                  <span className="ml-auto text-xs text-accent-primary">Active</span>
                )}
              </div>
              <p className="text-xs text-secondary">{db.description}</p>
              {db.setup === 'embedded' && (
                <p className="text-xs text-success mt-1">✅ Ready to use - No setup needed!</p>
              )}
              {db.setup === 'required' && (
                <p className="text-xs text-accent-ai-debug mt-1">⚠️ Requires server installation</p>
              )}
            </button>
          ))}

          {selectedDatabase === 'sqlite' && (
            <div className="mt-6 p-4 border border-success bg-surface">
              <h3 className="font-medium mb-2 text-sm text-success">✅ SQLite - Ready!</h3>
              <p className="text-xs text-secondary mb-3">
                E-commerce database with users, orders, and products
              </p>
              <div className="text-xs space-y-1">
                <p>• <strong>Tables:</strong> users, orders, products</p>
                <p>• <strong>Data:</strong> 8 users, 10 orders, 8 products</p>
                <p>• <strong>Sample Query:</strong></p>
                <code className="block bg-background p-2 mt-1">SELECT * FROM users;</code>
              </div>
            </div>
          )}
          
          {selectedDatabase === 'mysql' && (
            <div className="mt-6 p-4 border border-success bg-surface">
              <h3 className="font-medium mb-2 text-sm text-success">✅ MySQL Demo - Ready!</h3>
              <p className="text-xs text-secondary mb-3">
                Customer transactions database (embedded, no MySQL server needed)
              </p>
              <div className="text-xs space-y-1">
                <p>• <strong>Tables:</strong> customers, transactions</p>
                <p>• <strong>Data:</strong> 5 customers, 6 transactions</p>
                <p>• <strong>Sample Query:</strong></p>
                <code className="block bg-background p-2 mt-1">SELECT * FROM customers;</code>
              </div>
            </div>
          )}
          
          {selectedDatabase === 'postgresql' && (
            <div className="mt-6 p-4 border border-success bg-surface">
              <h3 className="font-medium mb-2 text-sm text-success">✅ PostgreSQL Demo - Ready!</h3>
              <p className="text-xs text-secondary mb-3">
                Employee analytics database (embedded, no PostgreSQL server needed)
              </p>
              <div className="text-xs space-y-1">
                <p>• <strong>Tables:</strong> departments, employees, projects</p>
                <p>• <strong>Data:</strong> 4 departments, 8 employees, 4 projects</p>
                <p>• <strong>Sample Query:</strong></p>
                <code className="block bg-background p-2 mt-1">SELECT * FROM employees;</code>
              </div>
            </div>
          )}
          
          {selectedDatabase === 'sqlserver' && (
            <div className="mt-6 p-4 border border-accent-ai-debug bg-surface">
              <h3 className="font-medium mb-2 text-sm text-accent-ai-debug">⚠️ SQL Server - Setup Required</h3>
              <p className="text-xs text-secondary mb-3">
                SQL Server requires manual installation (Windows only)
              </p>
              <div className="text-xs space-y-2 mb-3">
                <p className="font-medium">Quick Setup:</p>
                <p>• Download: <a href="https://www.microsoft.com/sql-server/sql-server-downloads" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">microsoft.com/sql-server</a></p>
                <p>• Install SQL Server Express</p>
                <p>• Start SQL Server service</p>
              </div>
              <div className="p-3 bg-background border border-border text-xs">
                <p className="font-medium mb-1">💡 Quick Tip:</p>
                <p className="text-secondary">
                  Try <span className="font-medium text-primary">MySQL</span> or <span className="font-medium text-primary">PostgreSQL</span> instead - 
                  they're already embedded and ready to use with sample data!
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <DatabaseConfigDialog
        open={showConfigDialog}
        onOpenChange={setShowConfigDialog}
        database={selectedDatabase}
        config={tempConfig}
        onConfigChange={setTempConfig}
        onSave={saveConfig}
      />
    </div>
  );
};

export default DatabasePanel;