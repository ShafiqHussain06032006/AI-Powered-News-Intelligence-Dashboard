# AI News Intelligence Dashboard

React + Django dashboard for searching GNews articles, viewing VADER sentiment, saving articles locally, comparing country coverage, and generating Groq-powered headline summaries.

## Run On A Fresh Machine

Install Python 3.10+, Node.js 18+, and Git. Then run:

```bash
git clone https://github.com/ShafiqHussain06032006/AI-Powered-News-Intelligence-Dashboard.git
cd AI-Powered-News-Intelligence-Dashboard/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Open `backend/.env` and fill:

```env
GNEWS_API_KEY=your_gnews_key
GROQ_API_KEY=your_groq_key
```

Start the backend:

```bash
python manage.py migrate
python manage.py runserver
```

In a second terminal, start the frontend:

```bash
cd AI-Powered-News-Intelligence-Dashboard/frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Django, Django REST Framework
- APIs: GNews for news, Groq for summaries
- NLP: VADER sentiment analysis

## Useful Checks

```bash
cd backend
source venv/bin/activate
python manage.py check
python manage.py test news

cd ../frontend
npm run build
```

ScreenShorts
<img width="3018" height="1396" alt="image" src="https://github.com/user-attachments/assets/e7ddb2a4-bdb4-4bf5-a475-b40efe76b4fe" />
<img width="3024" height="980" alt="image" src="https://github.com/user-attachments/assets/85417f06-a905-441e-8a7b-ebc030ce3abb" />
<img width="3016" height="1648" alt="image" src="https://github.com/user-attachments/assets/0b8c070e-1e90-448b-b5f8-c949dd43c3d6" />



