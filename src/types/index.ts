export interface QueryResult {
  id: number;
  [key: string]: any;
}

export interface QueryState {
  input: string;
  sql: string;
  isLoading: boolean;
  results: QueryResult[];
  error: string | null;
  columns: string[];
}