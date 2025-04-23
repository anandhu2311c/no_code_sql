import React, { useState } from 'react';
import { SendIcon, Loader2, BookOpenIcon } from 'lucide-react';
import { getSampleQueries } from '../services/queryService';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const sampleQueries = getSampleQueries();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
    }
  };

  const handleSampleClick = (query: string) => {
    setInput(query);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex items-center mb-2">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Natural Language Query</h2>
            <button
              type="button"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="ml-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center text-sm"
            >
              <BookOpenIcon size={16} className="mr-1" />
              {showSuggestions ? 'Hide examples' : 'Show examples'}
            </button>
          </div>
          
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your query in natural language (e.g., 'Show all employees in the Engineering department')"
              className="w-full min-h-24 p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-200 resize-none transition-all duration-200 ease-in-out"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`absolute right-3 bottom-3 p-2 rounded-full ${
                input.trim() && !isLoading
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              } transition-colors duration-200`}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <SendIcon size={20} />
              )}
            </button>
          </div>
        </form>
      </div>
      
      {showSuggestions && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example queries:</p>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSampleClick(query)}
                className="text-sm px-3 py-1.5 bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-gray-600 transition-colors duration-150"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryInput;