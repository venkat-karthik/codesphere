import React from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  return (
    <pre className="bg-gray-800 dark:bg-gray-900 text-white p-4 rounded-md overflow-x-auto my-4 font-mono text-sm">
      <code>
        {code.trim()}
      </code>
    </pre>
  );
};

export default CodeBlock; 