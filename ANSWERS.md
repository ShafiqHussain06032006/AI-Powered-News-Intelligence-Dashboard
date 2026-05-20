# Answers

## 1. How to run

Install Python 3.10+, Node.js 18+, and Git.

```bash
git clone https://github.com/ShafiqHussain06032006/AI-Powered-News-Intelligence-Dashboard.git
cd AI-Powered-News-Intelligence-Dashboard/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Add your keys in `backend/.env`:

```env
GNEWS_API_KEY=your_gnews_key
GROQ_API_KEY=your_groq_key
```

Run the backend:

```bash
python manage.py migrate
python manage.py runserver
```

Run the frontend in a second terminal:

```bash
cd AI-Powered-News-Intelligence-Dashboard/frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

## 2. Stack choice

I chose React, Django, Django REST Framework, and Tailwind CSS because I have studied these technologies in my Web Engineering course and have practical experience with them. React makes the dashboard easier to split into reusable pieces like article cards, filters, summary panels, and saved articles. Django REST Framework is a good fit because it makes API endpoints fast to build, and Python works well with NLP libraries like VADER and NLTK. Tailwind helped me build a responsive UI quickly without writing a large custom CSS file.

A worse choice for this task would have been plain HTML, CSS, and JavaScript only, because the dashboard has multiple interactive states and reusable UI sections. Another worse choice would have been using a very heavy full-stack framework for everything, because this project only needs a small API backend and a focused React frontend.

## 3. One real edge case

One edge case is handling an upstream news API timeout. In `backend/news/views.py`, lines 48-52 wrap `fetch_news(api_params)` in a `try` block and return a `504` JSON response if `requests.exceptions.Timeout` happens. Without this handling, a slow or stuck GNews request could crash the endpoint or leave the frontend waiting with no clear error message.

The request timeout itself is set in `backend/news/services.py`, line 60, where the GNews request uses `timeout=5`.

## 4. AI usage

- Codex / ChatGPT: I used it to debug run errors, update the project from NewsAPI-style config to GNews, improve the React UI, and write clearer documentation. It suggested code changes, tests to run, and wording for the README and answers.
- Groq API: The app uses Groq to summarize returned article headlines into five concise bullet points. The prompt asks it to summarize headlines and start each bullet with `•`.
- AI-generated UI suggestions: I used AI help to make the dashboard look less like a default scaffold and more like a human-built product dashboard, including better cards, spacing, empty states, and side panels.

One thing I changed about the AI output was the stack-choice answer. I specifically added that I chose this stack because I studied it in my Web Engineering course and already had experience with it. That makes the answer honest and personal instead of sounding generic.

## 5. Honest gap

The project is not good enough in automated test coverage. There are a few backend tests for API edge cases, but the frontend has no automated tests for search, filters, saving articles, summaries, or country compare. With another day, I would add React component tests and at least one end-to-end test that starts both servers, searches a topic, checks that articles render, saves an article, and verifies the summary flow.
