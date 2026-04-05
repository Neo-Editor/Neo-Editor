import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const ResultsTable = ({ result, dataTestId }) => {
  if (!result) {
    return (
      <div className="flex items-center justify-center h-full text-secondary" data-testid={dataTestId}>
        <p>No results yet. Run a query to see results here.</p>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="p-4" data-testid={`${dataTestId}-error`}>
        <h3 className="font-bold text-lg mb-3 text-error">Error</h3>
        <div className="p-4 bg-surface border border-error">
          <pre className="text-sm font-mono whitespace-pre-wrap break-words text-error">
            {result.error}
          </pre>
        </div>
        {result.execution_time && (
          <p className="text-xs text-secondary mt-2">Execution time: {result.execution_time?.toFixed(3)}s</p>
        )}
      </div>
    );
  }

  if (result.affected_rows !== null && result.affected_rows !== undefined) {
    return (
      <div className="p-4 text-success" data-testid={`${dataTestId}-success`}>
        <h3 className="font-bold text-lg mb-2">Success</h3>
        <p>Affected rows: {result.affected_rows}</p>
        <p className="text-sm text-secondary mt-1">Execution time: {result.execution_time?.toFixed(3)}s</p>
      </div>
    );
  }

  if (!result.columns || result.columns.length === 0) {
    return (
      <div className="p-4 text-secondary" data-testid={`${dataTestId}-empty`}>
        <p>Query executed successfully but returned no results.</p>
        <p className="text-sm mt-1">Execution time: {result.execution_time?.toFixed(3)}s</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto" data-testid={dataTestId}>
      <div className="p-2 border-b border-border bg-surface sticky top-0 z-10">
        <p className="text-xs text-secondary">
          {result.rows?.length || 0} rows returned • Execution time: {result.execution_time?.toFixed(3)}s
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {result.columns.map((col, idx) => (
              <TableHead key={idx} className="text-xs uppercase tracking-wider">{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.rows && result.rows.length > 0 ? (
            result.rows.map((row, rowIdx) => (
              <TableRow key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <TableCell key={cellIdx} className="text-sm font-mono">
                    {cell === null ? <span className="text-secondary italic">NULL</span> : String(cell)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={result.columns.length} className="text-center text-secondary">
                No data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResultsTable;