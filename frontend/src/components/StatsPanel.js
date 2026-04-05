import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChartBar, TrendUp, Database as DatabaseIcon, CheckCircle, XCircle } from '@phosphor-icons/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const COLORS = ['#3A75FF', '#F5A623', '#32D74B', '#FF453A', '#5C8DFF'];

const StatsPanel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-secondary">Loading statistics...</div>;
  }

  if (!stats) {
    return <div className="p-4 text-secondary">No statistics available</div>;
  }

  return (
    <div className="flex flex-col h-full" data-testid="stats-panel">
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg mb-1">Query Statistics</h2>
        <p className="text-xs text-secondary">
          Analytics and insights
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 border border-border bg-surface">
              <div className="flex items-center gap-2 mb-2">
                <ChartBar size={20} className="text-accent-primary" />
                <span className="text-xs uppercase tracking-wider text-secondary">Total Queries</span>
              </div>
              <p className="text-2xl font-bold">{stats.total_queries}</p>
            </div>
            <div className="p-4 border border-border bg-surface">
              <div className="flex items-center gap-2 mb-2">
                <TrendUp size={20} className="text-success" />
                <span className="text-xs uppercase tracking-wider text-secondary">Success Rate</span>
              </div>
              <p className="text-2xl font-bold">{stats.success_rate}%</p>
            </div>
            <div className="p-4 border border-border bg-surface">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} className="text-success" />
                <span className="text-xs uppercase tracking-wider text-secondary">Successful</span>
              </div>
              <p className="text-2xl font-bold">{stats.successful_queries}</p>
            </div>
            <div className="p-4 border border-border bg-surface">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={20} className="text-error" />
                <span className="text-xs uppercase tracking-wider text-secondary">Failed</span>
              </div>
              <p className="text-2xl font-bold">{stats.failed_queries}</p>
            </div>
          </div>

          {/* Database Distribution */}
          {stats.database_distribution && stats.database_distribution.length > 0 && (
            <div className="p-4 border border-border bg-surface">
              <h3 className="font-medium mb-3 text-sm">Database Usage</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.database_distribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis dataKey="database" stroke="rgb(var(--text-secondary))" style={{fontSize: '12px'}} />
                  <YAxis stroke="rgb(var(--text-secondary))" style={{fontSize: '12px'}} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgb(var(--surface))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: '0'
                    }}
                  />
                  <Bar dataKey="count" fill="rgb(var(--accent-primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent Activity */}
          <div className="p-4 border border-border bg-surface">
            <h3 className="font-medium mb-2 text-sm">Recent Activity</h3>
            <p className="text-xs text-secondary mb-1">Last 7 days</p>
            <p className="text-3xl font-bold text-accent-primary">{stats.queries_last_7_days}</p>
            <p className="text-xs text-secondary mt-1">queries executed</p>
          </div>

          <button
            onClick={loadStats}
            className="w-full px-4 py-2 border border-border hover:bg-background text-sm"
            data-testid="refresh-stats-button"
          >
            Refresh Statistics
          </button>
        </div>
      </ScrollArea>
    </div>
  );
};

export default StatsPanel;