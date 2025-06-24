import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

const TestCodeMirror = () => {
  const [value, setValue] = useState('');

  return (
    <div>
      <h2>Test CodeMirror</h2>
      <CodeMirror
        value={value}
        options={{
          mode: 'javascript',
          theme: 'material',
          lineNumbers: true,
        }}
        onBeforeChange={(editor, data, value) => {
          setValue(value);
        }}
      />
      {/* Display the value for debugging */}
      <pre>{value}</pre>  
    </div>
  );
};

export default TestCodeMirror;
