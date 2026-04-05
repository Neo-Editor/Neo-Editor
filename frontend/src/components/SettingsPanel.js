import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Gear } from '@phosphor-icons/react';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    debug_enabled: true,
    auto_save_history: true,
    syntax_highlighting: true,
    max_history_items: 100
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      await axios.put(`${API}/settings`, newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    updateSettings(newSettings);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return <div className="p-4 text-secondary">Loading settings...</div>;
  }

  const settingsConfig = [
    {
      key: 'debug_enabled',
      label: 'AI Debug Assistant',
      description: 'Enable AI-powered query debugging and suggestions'
    },
    {
      key: 'auto_save_history',
      label: 'Auto-Save History',
      description: 'Automatically save all executed queries to history'
    },
    {
      key: 'syntax_highlighting',
      label: 'Syntax Highlighting',
      description: 'Highlight SQL syntax in the editor'
    }
  ];

  return (
    <div className="flex flex-col h-full" data-testid="settings-panel">
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg mb-2">Settings</h2>
        <p className="text-xs text-secondary">
          Customize your SQL Studio experience
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {settingsConfig.map((setting) => (
            <div
              key={setting.key}
              data-testid={`setting-${setting.key}`}
              className="flex items-center justify-between p-4 border border-border"
            >
              <div className="flex-1">
                <h3 className="font-medium text-sm mb-1">{setting.label}</h3>
                <p className="text-xs text-secondary">{setting.description}</p>
              </div>
              <Switch
                checked={settings[setting.key]}
                onCheckedChange={() => toggleSetting(setting.key)}
                data-testid={`toggle-${setting.key}`}
              />
            </div>
          ))}

          <div className="mt-6 p-4 border border-border bg-surface">
            <h3 className="font-medium mb-2 text-sm">About SQL Studio</h3>
            <p className="text-xs text-secondary mb-2">
              A powerful desktop SQL client with multi-database support, AI debugging, and encrypted file storage.
            </p>
            <div className="text-xs text-secondary space-y-1">
              <p>• Supports SQLite, MySQL, PostgreSQL, and SQL Server</p>
              <p>• Local AI-powered debugging</p>
              <p>• Encrypted query storage</p>
              <p>• Query history tracking</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SettingsPanel;