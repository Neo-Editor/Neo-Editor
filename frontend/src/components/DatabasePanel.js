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

  const databases = [
    { value: 'sqlite', label: 'SQLite', description: 'File-based database, perfect for testing' },
    { value: 'mysql', label: 'MySQL', description: 'Popular open-source relational database' },
    { value: 'postgresql', label: 'PostgreSQL', description: 'Advanced open-source database' },
    { value: 'sqlserver', label: 'SQL Server', description: 'Microsoft SQL Server' }
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
    if (db !== 'sqlite') {
      setTempConfig({});
      setShowConfigDialog(true);
    } else {
      onConfigChange({ database: '/tmp/sql_studio_default.db' });
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
            </button>
          ))}

          {selectedDatabase === 'sqlite' && (
            <div className="mt-6 p-4 border border-border bg-surface">
              <h3 className="font-medium mb-2 text-sm">Sample Database</h3>
              <p className="text-xs text-secondary mb-3">
                Create a sample database with users and orders tables for testing
              </p>
              <button
                onClick={createSampleDatabase}
                data-testid="create-sample-db-button"
                className="w-full px-4 py-2 bg-accent-primary text-white hover:bg-accent-hover text-sm"
              >
                {sampleDbCreated ? 'Recreate Sample Database' : 'Create Sample Database'}
              </button>
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