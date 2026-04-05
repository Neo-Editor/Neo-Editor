import React from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const DatabaseConfigDialog = ({ open, onOpenChange, database, config, onConfigChange, onSave }) => {
  const renderConfig = () => {
    if (database === 'sqlite') {
      return (
        <div>
          <label className="text-sm font-medium">Database Path</label>
          <Input
            value={config.database || '/tmp/sample_database.db'}
            onChange={(e) => onConfigChange({ database: e.target.value })}
            placeholder="/path/to/database.db"
            data-testid="sqlite-path-input"
          />
          <p className="text-xs text-secondary mt-1">Use /tmp/sample_database.db for the sample database</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Host</label>
          <Input
            value={config.host || 'localhost'}
            onChange={(e) => onConfigChange({ ...config, host: e.target.value })}
            placeholder="localhost"
            data-testid="db-host-input"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Port</label>
          <Input
            type="number"
            value={config.port || (database === 'mysql' ? 3306 : database === 'postgresql' ? 5432 : 1433)}
            onChange={(e) => onConfigChange({ ...config, port: parseInt(e.target.value) })}
            placeholder="Port"
            data-testid="db-port-input"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Username</label>
          <Input
            value={config.user || ''}
            onChange={(e) => onConfigChange({ ...config, user: e.target.value })}
            placeholder="Username"
            data-testid="db-user-input"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            value={config.password || ''}
            onChange={(e) => onConfigChange({ ...config, password: e.target.value })}
            placeholder="Password"
            data-testid="db-password-input"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Database Name</label>
          <Input
            value={config.database || ''}
            onChange={(e) => onConfigChange({ ...config, database: e.target.value })}
            placeholder="Database name"
            data-testid="db-name-input"
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="database-config-dialog">
        <DialogHeader>
          <DialogTitle>Configure {database?.toUpperCase()} Connection</DialogTitle>
          <DialogDescription>
            Enter connection details for your database
          </DialogDescription>
        </DialogHeader>
        {renderConfig()}
        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-border hover:bg-background"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            data-testid="save-db-config-button"
            className="px-4 py-2 bg-accent-primary text-white hover:bg-accent-hover"
          >
            Save & Connect
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DatabaseConfigDialog;