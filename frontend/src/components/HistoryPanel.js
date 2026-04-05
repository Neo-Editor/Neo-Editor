import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash } from '@phosphor-icons/react';
import { ScrollArea } from '@/components/ui/scroll-area';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HistoryPanel = ({ onSelectQuery }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API}/query/history?limit=50`);
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all history?')) return;
    
    try {
      await axios.delete(`${API}/query/history`);
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return <div className="p-4 text-secondary">Loading history...</div>;
  }

  return (
    <div className="flex flex-col h-full" data-testid="history-panel">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-bold text-lg">Query History</h2>
        <button
          onClick={clearHistory}
          data-testid="clear-history-button"
          className="p-2 hover:bg-background text-error transition-colors"
          aria-label="Clear history"
        >
          <Trash size={18} />
        </button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {history.length === 0 ? (
            <p className="text-secondary text-sm p-4">No query history yet</p>
          ) : (
            history.map((item, idx) => (
              <button
                key={item.id || idx}
                onClick={() => onSelectQuery(item.query)}
                data-testid={`history-item-${idx}`}
                className="w-full text-left p-3 mb-2 border border-border hover:bg-background transition-colors block"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider text-secondary">{item.database_type}</span>
                  <span className={`text-xs ${item.success ? 'text-success' : 'text-error'}`}>
                    {item.success ? '✓' : '✗'}
                  </span>
                </div>
                <p className="text-sm font-mono text-primary truncate">{item.query}</p>
                <p className="text-xs text-secondary mt-1">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HistoryPanel;