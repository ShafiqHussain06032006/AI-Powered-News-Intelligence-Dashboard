# AI News Intelligence Dashboard

AI-powered dashboard that aggregates news from NewsAPI, performs sentiment analysis with VADER, and summarizes top headlines using Groq AI.

## Architecture

React → Django REST API → NewsAPI + Groq AI

## Prerequisites
- Python 3.10+
- Node.js 18+
- NewsAPI key (free at newsapi.org)
- Groq API key (free at console.groq.com)

## Setup & Run (fresh machine)

```bash
git clone https://github.com/ShafiqHussain06032006/AI-Powered-News-Intelligence-Dashboard.git
cd AI-Powered-News-Intelligence-Dashboard/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Fill NEWS_API_KEY and GROQ_API_KEY in .env
python manage.py migrate
python manage.py runserver

# in another terminal
cd ../frontend
npm install
npm run dev
```

## Environment Variables

- `NEWS_API_KEY`: API key from newsapi.org
- `GROQ_API_KEY`: API key from console.groq.com
- `SECRET_KEY`: Django secret key
- `DEBUG`: True/False
- `ALLOWED_HOSTS`: comma-separated hosts
- `CORS_ALLOWED_ORIGINS`: e.g. http://localhost:3000

## Features

- Search bar with filters
- Filters: Country, Category, Date range, Source
- Articles grid with sentiment badges and save/bookmark
- AI summary panel using Groq (5 bullet points)
- Trending keywords extraction
- Country compare view (US / PK / IN)
- Saved articles persisted to localStorage
- Dark / Light mode toggle, loading skeletons, error toasts

## API Flow

1. User searches from React frontend
2. Django proxies request to NewsAPI (timeout=5)
3. VADER computes sentiment on title+description
4. Groq summarizes headlines when requested
5. Frontend displays articles, summary, and allows saving

## Screenshots
[Add screenshots here]

