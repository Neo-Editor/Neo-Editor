import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FloppyDisk, Trash, LockKey, LockKeyOpen } from '@phosphor-icons/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FilesPanel = ({ currentQuery, currentDatabase, onSelectQuery }) => {
  const [savedQueries, setSavedQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDecryptDialog, setShowDecryptDialog] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [saveForm, setSaveForm] = useState({ name: '', encrypted: false, password: '' });
  const [decryptPassword, setDecryptPassword] = useState('');

  const fetchSavedQueries = async () => {
    try {
      const response = await axios.get(`${API}/query/saved`);
      setSavedQueries(response.data);
    } catch (error) {
      console.error('Failed to fetch saved queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveQuery = async () => {
    if (!saveForm.name.trim()) {
      alert('Please enter a name for the query');
      return;
    }

    if (saveForm.encrypted && !saveForm.password) {
      alert('Please enter a password for encryption');
      return;
    }

    try {
      await axios.post(`${API}/query/save`, {
        name: saveForm.name,
        query: currentQuery,
        database_type: currentDatabase,
        encrypted: saveForm.encrypted,
        password: saveForm.encrypted ? saveForm.password : null
      });
      
      setSaveForm({ name: '', encrypted: false, password: '' });
      setShowSaveDialog(false);
      fetchSavedQueries();
    } catch (error) {
      console.error('Failed to save query:', error);
      alert('Failed to save query');
    }
  };

  const deleteQuery = async (queryId) => {
    if (!window.confirm('Are you sure you want to delete this query?')) return;
    
    try {
      await axios.delete(`${API}/query/saved/${queryId}`);
      fetchSavedQueries();
    } catch (error) {
      console.error('Failed to delete query:', error);
    }
  };

  const loadQuery = async (query) => {
    if (query.encrypted) {
      setSelectedQuery(query);
      setShowDecryptDialog(true);
    } else {
      onSelectQuery(query.query);
    }
  };

  const decryptAndLoad = async () => {
    if (!decryptPassword) {
      alert('Please enter the password');
      return;
    }

    try {
      const response = await axios.post(`${API}/query/decrypt`, {
        query_id: selectedQuery.id,
        password: decryptPassword
      });
      
      onSelectQuery(response.data.query);
      setShowDecryptDialog(false);
      setDecryptPassword('');
      setSelectedQuery(null);
    } catch (error) {
      alert('Invalid password or decryption failed');
    }
  };

  useEffect(() => {
    fetchSavedQueries();
  }, []);

  if (loading) {
    return <div className="p-4 text-secondary">Loading saved queries...</div>;
  }

  return (
    <div className="flex flex-col h-full" data-testid="files-panel">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-bold text-lg">Saved Queries</h2>
        <button
          onClick={() => setShowSaveDialog(true)}
          data-testid="save-query-button"
          className="flex items-center gap-2 px-3 py-2 bg-accent-primary text-white hover:bg-accent-hover transition-colors text-sm"
        >
          <FloppyDisk size={16} />
          Save Current
        </button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {savedQueries.length === 0 ? (
            <p className="text-secondary text-sm p-4">No saved queries yet</p>
          ) : (
            savedQueries.map((query, idx) => (
              <div
                key={query.id || idx}
                data-testid={`saved-query-${idx}`}
                className="p-3 mb-2 border border-border hover:bg-background transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{query.name}</h3>
                    {query.encrypted && (
                      <LockKey size={14} className="text-accent-ai-debug" />
                    )}
                  </div>
                  <button
                    onClick={() => deleteQuery(query.id)}
                    className="p-1 hover:bg-background text-error transition-colors"
                    aria-label="Delete query"
                  >
                    <Trash size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-secondary">{query.database_type}</span>
                  <button
                    onClick={() => loadQuery(query)}
                    data-testid={`load-query-${idx}`}
                    className="text-xs text-accent-primary hover:underline"
                  >
                    Load
                  </button>
                </div>
                {!query.encrypted && (
                  <p className="text-xs font-mono text-secondary mt-2 truncate">{query.query}</p>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent data-testid="save-dialog">
          <DialogHeader>
            <DialogTitle>Save Query</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Query Name</label>
              <Input
                value={saveForm.name}
                onChange={(e) => setSaveForm({ ...saveForm, name: e.target.value })}
                placeholder="Enter query name"
                data-testid="save-name-input"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="encrypted"
                checked={saveForm.encrypted}
                onChange={(e) => setSaveForm({ ...saveForm, encrypted: e.target.checked })}
                data-testid="encrypt-checkbox"
              />
              <label htmlFor="encrypted" className="text-sm">Encrypt with password</label>
            </div>
            {saveForm.encrypted && (
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={saveForm.password}
                  onChange={(e) => setSaveForm({ ...saveForm, password: e.target.value })}
                  placeholder="Enter encryption password"
                  data-testid="encrypt-password-input"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="px-4 py-2 border border-border hover:bg-background"
            >
              Cancel
            </button>
            <button
              onClick={saveQuery}
              data-testid="confirm-save-button"
              className="px-4 py-2 bg-accent-primary text-white hover:bg-accent-hover"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decrypt Dialog */}
      <Dialog open={showDecryptDialog} onOpenChange={setShowDecryptDialog}>
        <DialogContent data-testid="decrypt-dialog">
          <DialogHeader>
            <DialogTitle>Enter Password</DialogTitle>
          </DialogHeader>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={decryptPassword}
              onChange={(e) => setDecryptPassword(e.target.value)}
              placeholder="Enter password to decrypt"
              data-testid="decrypt-password-input"
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => {
                setShowDecryptDialog(false);
                setDecryptPassword('');
              }}
              className="px-4 py-2 border border-border hover:bg-background"
            >
              Cancel
            </button>
            <button
              onClick={decryptAndLoad}
              data-testid="confirm-decrypt-button"
              className="px-4 py-2 bg-accent-primary text-white hover:bg-accent-hover"
            >
              Decrypt & Load
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FilesPanel;