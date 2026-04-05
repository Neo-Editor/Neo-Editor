import React, { useState } from 'react';
import axios from 'axios';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import SQLEditor from './components/SQLEditor';
import ResultsTable from './components/ResultsTable';
import HistoryPanel from './components/HistoryPanel';
import FilesPanel from './components/FilesPanel';
import DatabasePanel from './components/DatabasePanel';
import DebugPanel from './components/DebugPanel';
import SettingsPanel from './components/SettingsPanel';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import '@/App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const databases = [
  { value: 'sqlite', label: 'SQLite' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlserver', label: 'SQL Server' }
];

function AppContent() {
  const [activeSection, setActiveSection] = useState('editor');
  const [selectedDatabase, setSelectedDatabase] = useState('sqlite');
  const [dbConfig, setDbConfig] = useState({ database: '/tmp/sql_studio_default.db' });
  const [query, setQuery] = useState(`-- Welcome to SQL Studio! 🚀
-- Database ready to use - no setup needed!

-- Sample Query: View all users
SELECT * FROM users;`);
  const [result, setResult] = useState(null);
  const [lastError, setLastError] = useState(null);
  const [executing, setExecuting] = useState(false);

  const executeQuery = async () => {
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }

    setExecuting(true);
    setLastError(null);

    try {
      const response = await axios.post(`${API}/query/execute`, {
        database_type: selectedDatabase,
        query: query.trim(),
        connection_params: dbConfig
      });

      setResult(response.data);

      if (response.data.success) {
        toast.success('Query executed successfully');
      } else {
        setLastError(response.data.error);
        toast.error('Query failed');
      }
    } catch (error) {
      console.error('Execution failed:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to execute query';
      setLastError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setExecuting(false);
    }
  };

  const refreshResults = () => {
    setResult(null);
    setLastError(null);
    toast.info('Results cleared');
  };

  const handleSelectQuery = (selectedQuery) => {
    setQuery(selectedQuery);
    setActiveSection('editor');
    toast.success('Query loaded');
  };

  const renderPanel = () => {
    switch (activeSection) {
      case 'history':
        return <HistoryPanel onSelectQuery={handleSelectQuery} />;
      case 'files':
        return (
          <FilesPanel
            currentQuery={query}
            currentDatabase={selectedDatabase}
            onSelectQuery={handleSelectQuery}
          />
        );
      case 'database':
        return (
          <DatabasePanel
            selectedDatabase={selectedDatabase}
            onDatabaseChange={setSelectedDatabase}
            onConfigChange={setDbConfig}
          />
        );
      case 'debug':
        return <DebugPanel currentQuery={query} lastError={lastError} />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background text-foreground" data-testid="app-container">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Toolbar
          onRun={executeQuery}
          onRefresh={refreshResults}
          selectedDatabase={selectedDatabase}
          onDatabaseChange={setSelectedDatabase}
          databases={databases}
        />
        
        <div className="flex-1 flex overflow-hidden">
          {activeSection === 'editor' || activeSection === null ? (
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 min-h-[40%] border-b border-border relative" data-testid="editor-pane">
                <SQLEditor
                  value={query}
                  onChange={setQuery}
                  dataTestId="sql-editor-input"
                />
                {executing && (
                  <div className="absolute top-2 right-2 px-3 py-1 bg-accent-primary text-white text-xs">
                    Executing...
                  </div>
                )}
              </div>
              <div className="h-[40%] bg-surface overflow-auto relative" data-testid="results-pane">
                <ResultsTable result={result} dataTestId="results-table" />
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              {renderPanel()}
            </div>
          )}
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
