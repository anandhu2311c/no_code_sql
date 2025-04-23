import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def test_groq_api():
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "deepseek-r1-distill-llama-70b",
        "messages": [
            {"role": "user", "content": "Say hello!"}
        ],
        "temperature": 0.1,
        "max_tokens": 50
    }
    
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=data
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("Groq API is working correctly!")
        else:
            print("There's an issue with your Groq API key or request")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_groq_api()