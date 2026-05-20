Q1. How to run

Follow the commands in README.md. Example:

```bash
git clone https://github.com/ShafiqHussain06032006/AI-Powered-News-Intelligence-Dashboard.git
cd AI-Powered-News-Intelligence-Dashboard/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# fill keys
python manage.py migrate
python manage.py runserver
cd ../frontend
npm install
npm run dev
```

If you hit a NewsAPI rate limit, wait 60 seconds — free tier allows limited requests.

Q2. Stack choice

- React: component reusability (cards, panels), hooks for async state.
- Django + DRF: mature ecosystem for Python NLP tools (VADER, NLTK), quick to scaffold APIs.
- Tailwind: rapid styling and consistent utility classes for responsive layouts.

Worse choices would be plain HTML/JS + Flask (no component model), or Next.js + FastAPI (overkill for assessment scope).

Q3. One real edge case

In `backend/news/views.py` the `fetch_news` calls use `timeout=5` (search endpoint) to avoid hanging requests — without this, a slow NewsAPI call would block the Django request and the frontend would wait indefinitely (see the Timeout handling in `search_news`).

Q4. AI usage

- AI tool: Groq API (model `llama3-8b-8192`). Prompt used: "Summarize these news headlines in exactly 5 concise bullet points. Start each with •"
- What it returned: raw text with bullet points (stored in `summary` field returned to frontend).
- Note: I used VADER for sentiment instead of TextBlob because VADER is tuned for short news/social text and gives a compound score useful for thresholds.

Q5. Honest gap

Trending keywords are extracted from only the top 20 headlines due to NewsAPI free-tier limits and latency concerns. With more time I would compute TF-IDF over a larger corpus and add a word-cloud visualization.

