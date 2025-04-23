import { QueryResult } from '../types';

const API_BASE_URL = 'http://localhost:8000'; // Change this to your production URL when deployed

export const generateSqlFromNaturalLanguage = async (
  input: string
): Promise<{ sql: string; results: QueryResult[]; columns: string[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: input }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate SQL query');
    }

    const data = await response.json();
    
    // Extract columns from the first result
    const columns = data.result && data.result.length > 0 
      ? Object.keys(data.result[0])
      : [];

    // Transform the raw database results into our QueryResult format
    const results = data.result.map((row: any, index: number) => ({
      id: index + 1,
      ...row
    }));

    return {
      sql: data.sql,
      results,
      columns
    };
  } catch (error) {
    console.error('Error in generateSqlFromNaturalLanguage:', error);
    throw error;
  }
};

export const getSampleQueries = (): string[] => {
  return [
    "Show me all employees",
    "List employees in the Engineering department",
    "Show employees with salary above 90000",
    "What is the average salary by department?",
    "Count employees in each department",
    "Show only employee names and email addresses",
    "Which employees are in Marketing?"
  ];
};