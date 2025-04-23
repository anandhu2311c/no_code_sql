
# 🧠 No Code SQL

**Query your database using natural language — no SQL knowledge required.**  
With **No Code SQL**, you can write natural language questions like:

> _"What is the average salary of employees?"_

...and get valid SQL results, instantly — **without knowing any SQL syntax**.

Behind the scenes, your query is interpreted by a smart **LLM (via DeekSeek API)**, translated to SQL, and securely executed on your **Supabase** database. This is perfect for analysts, product managers, or anyone who wants quick access to data insights without writing raw queries.

---

## ✨ Preview

| 💬 LLM converting natural language → SQL (Backend Terminal) | 🖥️ UI Output showing result |
|---|---|
| ![LLM NLP to SQL](https://github.com/anandhu2311c/no_code_sql/blob/58cd068067265dbac2db5dfc5d63dff5d2e5f49a/src/components/Screenshot%202025-04-20%20215123.png?raw=true) | ![App Result 1](https://github.com/anandhu2311c/no_code_sql/blob/58cd068067265dbac2db5dfc5d63dff5d2e5f49a/src/components/Screenshot%202025-04-23%20223121.png?raw=true) ![App Result 2](https://github.com/anandhu2311c/no_code_sql/blob/58cd068067265dbac2db5dfc5d63dff5d2e5f49a/src/components/Screenshot%202025-04-23%20223201.png?raw=true) |

📦 Supabase Database Schema (for reference):  
![Supabase Schema](https://github.com/anandhu2311c/no_code_sql/blob/58cd068067265dbac2db5dfc5d63dff5d2e5f49a/src/components/Screenshot%202025-04-23%20223325.png?raw=true)

---

## ⚙️ Tech Stack

- ⚛️ **React + TypeScript + Vite** – lightweight, fast, and modern frontend
- 🧠 **DeekSeek API** – powerful LLM for converting text → SQL
- 🛢 **Supabase** – open-source Firebase alternative (PostgreSQL + Auth + API)
- 🔒 **Secure SQL Execution** – queries run safely using Supabase's serverless functions

---

## 🛠️ Setup

Clone the repo and install dependencies:

```bash
git clone https://github.com/anandhu2311c/no_code_sql.git
cd no_code_sql
npm install
```

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_URL=https://api.deekseek.ai/llm-to-sql
VITE_GROQ_API_KEY=your_deekseek_api_key
```

> ✅ You can rename the `VITE_GROQ_*` variables to `VITE_DEEKSEEK_*` for clarity.

Then start the development server:

```bash
npm run dev
```

Now you're ready to ask your database anything!

---
