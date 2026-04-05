import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tree, Database, Table, CaretRight, CaretDown } from '@phosphor-icons/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SchemaExplorer = ({ database, dbConfig }) => {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedTables, setExpandedTables] = useState(new Set());

  useEffect(() => {
    if (database) {
      loadSchema();
    }
  }, [database, dbConfig]);

  const loadSchema = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/schema`, {
        database_type: database,
        connection_params: dbConfig
      });
      setSchema(response.data);
      // Auto-expand first table
      if (response.data.tables && response.data.tables.length > 0) {
        setExpandedTables(new Set([response.data.tables[0].name]));
      }
    } catch (error) {
      console.error('Failed to load schema:', error);
      toast.error('Failed to load database schema');
      setSchema(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleTable = (tableName) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  if (loading) {
    return (
      <div className="p-4 text-secondary" data-testid="schema-loading">
        Loading schema...
      </div>
    );
  }

  if (!schema || !schema.tables || schema.tables.length === 0) {
    return (
      <div className="p-4 text-secondary text-center">
        <Database size={48} className="mx-auto mb-4 opacity-30" />
        <p className="text-sm">No tables found in database</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="schema-explorer">
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg mb-1">Schema Explorer</h2>
        <p className="text-xs text-secondary">
          {schema.tables.length} table{schema.tables.length !== 1 ? 's' : ''}
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {schema.tables.map((table) => {
            const isExpanded = expandedTables.has(table.name);
            return (
              <div
                key={table.name}
                className="mb-2 border border-border bg-surface"
                data-testid={`schema-table-${table.name}`}
              >
                <button
                  onClick={() => toggleTable(table.name)}
                  className="w-full flex items-center gap-2 p-3 hover:bg-background text-left"
                >
                  {isExpanded ? (
                    <CaretDown size={16} weight="bold" />
                  ) : (
                    <CaretRight size={16} weight="bold" />
                  )}
                  <Table size={18} weight="fill" className="text-accent-primary" />
                  <span className="font-medium">{table.name}</span>
                  <span className="ml-auto text-xs text-secondary">
                    {table.columns.length} columns
                  </span>
                </button>
                {isExpanded && (
                  <div className="border-t border-border">
                    {table.columns.map((col, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-background"
                        data-testid={`schema-column-${col.name}`}
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          {col.primary_key && (
                            <span className="text-accent-ai-debug font-bold">🔑</span>
                          )}
                        </div>
                        <span className="font-mono text-primary">{col.name}</span>
                        <span className="text-xs text-secondary">{col.type}</span>
                        {!col.nullable && (
                          <span className="text-xs text-error">NOT NULL</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="p-3 border-t border-border bg-surface">
        <button
          onClick={loadSchema}
          className="w-full px-3 py-2 text-sm border border-border hover:bg-background"
          data-testid="refresh-schema-button"
        >
          Refresh Schema
        </button>
      </div>
    </div>
  );
};

export default SchemaExplorer;