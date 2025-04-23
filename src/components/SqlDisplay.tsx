import React from 'react';
import { CopyIcon, CheckIcon } from 'lucide-react';

interface SqlDisplayProps {
  sql: string;
}

const SqlDisplay: React.FC<SqlDisplayProps> = ({ sql }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightSql = (code: string) => {
    if (!code) return '';
    
    const parts: { text: string; type: 'keyword' | 'string' | 'number' | 'text' }[] = [];
    let currentIndex = 0;
    
    // Keywords to highlight
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT',
      'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
      'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL',
      'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'HAVING', 'AS', 'DISTINCT'
    ];
    
    // Find all tokens in the SQL
    const tokens = code.split(/(\s+|\b)/);
    
    tokens.forEach(token => {
      if (keywords.includes(token.toUpperCase())) {
        parts.push({ text: token, type: 'keyword' });
      } else if (/^".*"$/.test(token)) {
        parts.push({ text: token, type: 'string' });
      } else if (/^\d+$/.test(token)) {
        parts.push({ text: token, type: 'number' });
      } else {
        parts.push({ text: token, type: 'text' });
      }
    });

    return (
      <>
        {parts.map((part, index) => {
          let className = '';
          switch (part.type) {
            case 'keyword':
              className = 'text-orange-500 dark:text-orange-400 font-medium';
              break;
            case 'string':
              className = 'text-green-600 dark:text-green-400';
              break;
            case 'number':
              className = 'text-blue-600 dark:text-blue-400';
              break;
            default:
              className = 'text-gray-800 dark:text-gray-200';
          }
          return <span key={index} className={className}>{part.text}</span>;
        })}
      </>
    );
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Generated SQL Query</h3>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Copy SQL"
        >
          {copied ? <CheckIcon size={16} className="text-green-500" /> : <CopyIcon size={16} />}
        </button>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg overflow-x-auto">
        {sql ? (
          <pre className="text-sm font-mono whitespace-pre-wrap">
            {highlightSql(sql)}
          </pre>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            SQL query will appear here after you submit a natural language query.
          </div>
        )}
      </div>
    </div>
  );
};

export default SqlDisplay;