from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List
import os
from dotenv import load_dotenv
from text_to_sql import generate_sql_with_groq, run_sql
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(title="SQL Query Generator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    sql: str
    result: List[Dict[str, Any]]

@app.post("/query", response_model=QueryResponse)
async def handle_query(data: QueryRequest):
    try:
        logger.info(f"Received query: {data.question}")
        
        # Generate SQL from natural language using Groq
        sql = generate_sql_with_groq(data.question)
        logger.info(f"Generated SQL: {sql}")
        
        # Execute SQL on Supabase
        result = run_sql(sql)
        logger.info(f"Query executed successfully, returned {len(result)} rows")
        
        return {"sql": sql, "result": result}
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/test-groq")
async def test_groq():
    """
    Test endpoint to check if Groq API is working
    """
    try:
        sql = generate_sql_with_groq("Show me all employees")
        return {"status": "success", "sql": sql}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/")
async def root():
    return {"message": "SQL Query Generator API is running"}