import React from 'react';
import { Play, ArrowsClockwise, Moon, Sun } from '@phosphor-icons/react';
import { useTheme } from '../contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Toolbar = ({ onRun, onRefresh, selectedDatabase, onDatabaseChange, databases }) => {
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
          data-testid="run-query-button"
          className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white hover:bg-accent-hover transition-colors text-sm font-medium"
        >
          <Play size={16} weight="fill" />
          Run
        </button>
        <button
          onClick={onRefresh}
          data-testid="refresh-results-button"
          className="flex items-center gap-2 px-4 py-2 border border-border bg-surface hover:bg-background transition-colors text-sm"
        >
          <ArrowsClockwise size={16} />
          Refresh
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