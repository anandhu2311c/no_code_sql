import React, { useState } from 'react';
import { generateSqlFromNaturalLanguage } from './services/queryService';
import { QueryState } from './types';
import Header from './components/Header';
import QueryInput from './components/QueryInput';
import SqlDisplay from './components/SqlDisplay';
import ResultsTable from './components/ResultsTable';
import { AlertTriangleIcon } from 'lucide-react';

function App() {
  const [state, setState] = useState<QueryState>({
    input: '',
    sql: '',
    isLoading: false,
    results: [],
    error: null,
    columns: []
  });

  const handleSubmitQuery = async (input: string) => {
    setState({
      ...state,
      input,
      isLoading: true,
      error: null
    });
  
    try {
      const { sql, results, columns } = await generateSqlFromNaturalLanguage(input);
      
      setState({
        ...state,
        input,
        sql,
        results,
        columns,
        isLoading: false
      });
    } catch (error) {
      setState({
        ...state,
        error: error instanceof Error ? error.message : 'An error occurred while processing your query. Please try again.',
        isLoading: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <section>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <QueryInput
                onSubmit={handleSubmitQuery}
                isLoading={state.isLoading}
              />
            </div>
          </section>
          
          {state.error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 flex items-start">
              <AlertTriangleIcon size={20} className="mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Error processing your query</p>
                <p className="mt-1 text-sm">{state.error}</p>
              </div>
            </div>
          )}
          
          {(state.sql || state.isLoading) && (
            <section>
              <SqlDisplay sql={state.sql} />
            </section>
          )}
          
          {(state.results.length > 0 || state.isLoading) && (
            <section>
              <ResultsTable
                results={state.results}
                columns={state.columns}
                isLoading={state.isLoading}
              />
            </section>
          )}
        </div>
      </main>
      
      <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            SQL Query Builder — Natural language to SQL conversion tool
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;