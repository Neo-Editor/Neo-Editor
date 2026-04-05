import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism-tomorrow.css';

const SQLEditor = ({ value, onChange, placeholder, dataTestId }) => {
  return (
    <div className="h-full w-full overflow-auto bg-surface">
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={code => highlight(code, languages.sql, 'sql')}
        placeholder={placeholder || 'Enter your SQL query here...'}
        padding={16}
        data-testid={dataTestId}
        style={{
          fontFamily: 'JetBrains Mono, Source Code Pro, monospace',
          fontSize: 14,
          lineHeight: 1.5,
          minHeight: '100%',
          backgroundColor: 'var(--surface)',
          color: 'var(--text-primary)'
        }}
        textareaClassName="focus:outline-none"
      />
    </div>
  );
};

export default SQLEditor;