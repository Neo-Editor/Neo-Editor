import React, { useState } from 'react';
import axios from 'axios';
import { Sparkle, Lightbulb } from '@phosphor-icons/react';
import { ScrollArea } from '@/components/ui/scroll-area';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DebugPanel = ({ currentQuery, lastError }) => {
  const [debugging, setDebugging] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const debugQuery = async () => {
    if (!currentQuery.trim()) {
      alert('Please enter a query to debug');
      return;
    }

    setDebugging(true);
    try {
      const response = await axios.post(`${API}/debug`, {
        query: currentQuery,
        error_message: lastError
      });
      
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Debug failed:', error);
      alert('Failed to debug query');
    } finally {
      setDebugging(false);
    }
  };

  return (
    <div className="flex flex-col h-full" data-testid="debug-panel">
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg mb-2">AI Debug Assistant</h2>
        <p className="text-xs text-secondary mb-4">
          Analyze your SQL query and get intelligent suggestions using a local AI model.
        </p>
        <button
          onClick={debugQuery}
          disabled={debugging}
          data-testid="ai-debug-button"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-ai-debug text-black hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50"
        >
          <Sparkle size={18} weight="fill" />
          {debugging ? 'Analyzing...' : 'Debug Current Query'}
        </button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {suggestions.length === 0 ? (
            <div className="text-center text-secondary py-8">
              <Lightbulb size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">Click the debug button to analyze your query</p>
            </div>
          ) : (
            <div data-testid="debug-suggestions">
              <h3 className="font-medium mb-4 text-sm uppercase tracking-wider">Suggestions</h3>
              <div className="space-y-3">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    data-testid={`debug-suggestion-${idx}`}
                    className="p-3 border border-accent-ai-debug bg-surface"
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb size={16} className="text-accent-ai-debug mt-1 flex-shrink-0" />
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {lastError && (
            <div className="mt-6 p-3 border border-error bg-surface">
              <h4 className="text-xs uppercase tracking-wider text-error mb-2">Last Error</h4>
              <p className="text-xs font-mono">{lastError}</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DebugPanel;