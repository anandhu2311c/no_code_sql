import os
import requests
from dotenv import load_dotenv
import json

load_dotenv()

# Get API keys from environment variables
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

def generate_sql_with_groq(question):
    """
    Generate SQL query from natural language using Groq API
    """
    # First, let's use a more specific prompt for better results
    prompt = f"""Convert this natural language question to an SQL query for PostgreSQL.

Database schema:
Table: employees
Columns: 
- id (uuid, primary key)
- name (text, not null)
- email (text, unique, not null)
- department (text, not null)
- salary (integer, not null)
- hire_date (date, not null)
- created_at (timestamptz, default now())

Question: {question}

Return only the SQL query, no explanations."""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Using the correct Groq API endpoint format
    data = {
        "model": "deepseek-r1-distill-llama-70b",  # or "llama2-70b-4096" if Mixtral isn't available
        "messages": [
            {
                "role": "system", 
                "content": "You are an SQL expert. Convert natural language queries to SQL. Return only valid SQL."
            },
            {
                "role": "user", 
                "content": prompt
            }
        ],
        "temperature": 0.1,
        "max_tokens": 1024
    }
    
    try:
        print(f"Sending request to Groq with question: {question}")
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=data
        )
        
        # Debug: Print response for troubleshooting
        print(f"Groq API Status Code: {response.status_code}")
        if response.status_code != 200:
            print(f"Groq API Error Response: {response.text}")
        
        response.raise_for_status()
        
        # Get the SQL query from the response
        response_json = response.json()
        sql_query = response_json["choices"][0]["message"]["content"].strip()
        
        # Clean the SQL query (remove markdown code blocks if present)
        sql_query = sql_query.replace('```sql', '').replace('```', '').strip()
        
        print(f"Generated SQL: {sql_query}")
        return sql_query
        
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error: {e}")
        print(f"Response Content: {e.response.text}")
        raise Exception(f"Failed to generate SQL query: {str(e)}")
    except Exception as e:
        print(f"Error generating SQL with Groq: {e}")
        raise Exception(f"Failed to generate SQL query: {str(e)}")

def run_sql(query):
    """
    Execute SQL query on Supabase using REST API
    """
    try:
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        url = f"{SUPABASE_URL}/rest/v1/employees"
        params = {}
        
        query_upper = query.upper()
        
        # Handle SELECT statement
        if "SELECT" in query_upper:
            if "*" in query_upper:
                params["select"] = "*"
            else:
                select_part = query[query_upper.find("SELECT") + 6:query_upper.find("FROM")].strip()
                columns = [col.strip() for col in select_part.split(",")]
                params["select"] = ",".join(columns)
        else:
            # Default to selecting all columns
            params["select"] = "*"
        
        # Handle WHERE clauses
        if "WHERE" in query_upper:
            # Extract the WHERE clause
            where_start = query_upper.find("WHERE") + 5
            where_end = query_upper.find("ORDER BY") if "ORDER BY" in query_upper else query_upper.find("LIMIT") if "LIMIT" in query_upper else len(query_upper)
            where_clause = query[where_start:where_end].strip()
            
            # Handle salary > 90000 condition
            if "SALARY" in where_clause.upper() and ">" in where_clause:
                value = where_clause.split(">")[1].strip()
                params["salary"] = f"gt.{value}"
            elif "SALARY" in where_clause.upper() and "<" in where_clause:
                value = where_clause.split("<")[1].strip()
                params["salary"] = f"lt.{value}"
            elif "SALARY" in where_clause.upper() and "=" in where_clause:
                value = where_clause.split("=")[1].strip()
                params["salary"] = f"eq.{value}"
            
            # Handle department conditions
            if "DEPARTMENT" in where_clause.upper() and "=" in where_clause:
                start_idx = where_clause.upper().find("DEPARTMENT")
                end_idx = where_clause.find("AND", start_idx) if "AND" in where_clause[start_idx:] else len(where_clause)
                department_part = where_clause[start_idx:end_idx]
                parts = department_part.split("=")
                if len(parts) == 2:
                    department_value = parts[1].strip().strip("'\"")
                    params["department"] = f"eq.{department_value}"
        
        # Only add ORDER BY if it exists in the query
        if "ORDER BY" in query_upper:
            order_start = query_upper.find("ORDER BY") + 8
            order_end = query_upper.find("LIMIT") if "LIMIT" in query_upper else len(query_upper)
            order_clause = query[order_start:order_end].strip()
            
            parts = order_clause.split()
            if len(parts) >= 1:
                column = parts[0].lower()
                direction = "desc" if len(parts) > 1 and parts[1].upper() == "DESC" else "asc"
                params["order"] = f"{column}.{direction}"
        
        # Only add LIMIT if it exists in the query
        if "LIMIT" in query_upper:
            limit_start = query_upper.find("LIMIT") + 5
            limit_value = query[limit_start:].strip().split()[0]
            params["limit"] = limit_value
        
        # Make the request
        print(f"Making Supabase request to {url} with params: {params}")
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        result = response.json()
        print(f"Supabase response: {result}")
        return result
        
    except Exception as e:
        print(f"Error executing SQL query: {e}")
        raise Exception(f"Failed to execute SQL query: {str(e)}")