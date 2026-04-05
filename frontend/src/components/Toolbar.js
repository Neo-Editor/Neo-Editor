import React from 'react';
import { Play, ArrowsClockwise, Moon, Sun, Download, TextAlignLeft } from '@phosphor-icons/react';
import { useTheme } from '../contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Toolbar = ({ onRun, onRefresh, onFormat, onExport, selectedDatabase, onDatabaseChange, databases, executing, hasResults }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-14 border-b border-border flex items-center px-4 justify-between bg-surface">
      <div className="flex items-center gap-2">
        <Select value={selectedDatabase} onValueChange={onDatabaseChange}>
          <SelectTrigger className="w-40" data-testid="database-selector">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-50">
            {databases.map(db => (
              <SelectItem key={db.value} value={db.value}>
                {db.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          onClick={onRun}
          disabled={executing}
          data-testid="run-query-button"
          className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white hover:bg-accent-hover transition-colors text-sm font-medium disabled:opacity-50"
        >
          <Play size={16} weight="fill" />
          {executing ? 'Running...' : 'Run'}
        </button>
        <button
          onClick={onRefresh}
          data-testid="refresh-results-button"
          className="flex items-center gap-2 px-3 py-2 border border-border bg-surface hover:bg-background transition-colors text-sm"
        >
          <ArrowsClockwise size={16} />
          Refresh
        </button>
        <button
          onClick={onFormat}
          data-testid="format-query-button"
          className="flex items-center gap-2 px-3 py-2 border border-border bg-surface hover:bg-background transition-colors text-sm"
          title="Format Query (Ctrl+K)"
        >
          <TextAlignLeft size={16} />
          Format
        </button>
        <button
          onClick={onExport}
          disabled={!hasResults}
          data-testid="export-button"
          className="flex items-center gap-2 px-3 py-2 border border-border bg-surface hover:bg-background transition-colors text-sm disabled:opacity-50"
          title="Export Results (Ctrl+E)"
        >
          <Download size={16} />
          Export
        </button>
      </div>
      <button
        onClick={toggleTheme}
        data-testid="theme-toggle-button"
        className="p-2 hover:bg-background transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
};

export default Toolbar;