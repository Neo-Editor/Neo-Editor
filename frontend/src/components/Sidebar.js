import React from 'react';
import { ClockCounterClockwise, Folder, Database, Sparkle, Gear, Code, ChartBar } from '@phosphor-icons/react';

const Sidebar = ({ activeSection, onSectionChange, collapsed }) => {
  const sections = [
    { id: 'history', icon: ClockCounterClockwise, label: 'History' },
    { id: 'files', icon: Folder, label: 'Files' },
    { id: 'schema', icon: Database, label: 'Schema' },
    { id: 'snippets', icon: Code, label: 'Snippets' },
    { id: 'database', icon: Database, label: 'Database' },
    { id: 'debug', icon: Sparkle, label: 'Debug' },
    { id: 'stats', icon: ChartBar, label: 'Stats' },
    { id: 'settings', icon: Gear, label: 'Settings' }
  ];

  return (
    <div className="w-16 md:w-64 flex-shrink-0 border-r border-border bg-surface flex flex-col">
      <div className="h-14 border-b border-border flex items-center px-4">
        <h1 className="text-lg font-bold tracking-tight hidden md:block">SQL Studio</h1>
        <div className="w-8 h-8 bg-accent-primary rounded-sm flex items-center justify-center md:hidden">
          <Database size={20} weight="bold" className="text-white" />
        </div>
      </div>
      <nav className="flex-1 py-4">
        {sections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              data-testid={`sidebar-${section.id}-button`}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors border-l-2 ${
                isActive
                  ? 'border-accent-primary bg-background text-primary'
                  : 'border-transparent text-secondary hover:bg-background hover:text-primary'
              }`}
            >
              <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
              <span className="text-sm hidden md:block">{section.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;