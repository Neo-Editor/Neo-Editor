import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Code, Copy } from '@phosphor-icons/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SnippetsPanel = ({ onSelectSnippet }) => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = async () => {
    try {
      const response = await axios.get(`${API}/snippets`);
      setSnippets(response.data.snippets);
    } catch (error) {
      console.error('Failed to load snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySnippet = (query) => {
    navigator.clipboard.writeText(query);
    toast.success('Snippet copied to clipboard');
  };

  if (loading) {
    return <div className="p-4 text-secondary">Loading snippets...</div>;
  }

  return (
    <div className="flex flex-col h-full" data-testid="snippets-panel">
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg mb-1">SQL Snippets</h2>
        <p className="text-xs text-secondary">
          Common query templates
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {snippets.map((snippet, idx) => (
            <div
              key={idx}
              className="mb-3 p-3 border border-border hover:bg-background"
              data-testid={`snippet-${idx}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code size={18} weight="bold" className="text-accent-primary" />
                  <h3 className="font-medium text-sm">{snippet.name}</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleCopySnippet(snippet.query)}
                    className="p-1.5 hover:bg-background"
                    title="Copy to clipboard"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-secondary mb-2">{snippet.description}</p>
              <pre className="text-xs font-mono p-2 bg-background border border-border overflow-x-auto">
                {snippet.query}
              </pre>
              <button
                onClick={() => onSelectSnippet(snippet.query)}
                className="mt-2 w-full px-3 py-1.5 text-xs bg-accent-primary text-white hover:bg-accent-hover"
                data-testid={`use-snippet-${idx}`}
              >
                Use This Snippet
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SnippetsPanel;