import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Download } from '@phosphor-icons/react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ExportDialog = ({ open, onOpenChange, result }) => {
  const [format, setFormat] = useState('csv');
  const [filename, setFilename] = useState('query_results');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!result || !result.columns || !result.rows) {
      toast.error('No data to export');
      return;
    }

    setExporting(true);
    try {
      const response = await axios.post(`${API}/export`, {
        format,
        data: {
          columns: result.columns,
          rows: result.rows
        },
        filename
      });

      const { content, filename: exportFilename, encoding } = response.data;

      if (encoding === 'base64') {
        // For Excel files
        const blob = b64toBlob(content, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        saveAs(blob, exportFilename);
      } else {
        // For CSV, JSON, SQL
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, exportFilename);
      }

      toast.success(`Exported successfully as ${exportFilename}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="export-dialog">
        <DialogHeader>
          <DialogTitle>Export Query Results</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Export Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger data-testid="export-format-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="sql">SQL INSERT Statements</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Filename</label>
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="query_results"
              data-testid="export-filename-input"
            />
          </div>
          <div className="text-xs text-secondary">
            Exporting {result?.rows?.length || 0} rows
          </div>
        </div>
        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-border hover:bg-background"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            data-testid="export-button"
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white hover:bg-accent-hover disabled:opacity-50"
          >
            <Download size={16} />
            {exporting ? 'Exporting...' : 'Export'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;