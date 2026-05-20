import requests
from decouple import config

GROQ_API_KEY = config('GROQ_API_KEY', default='')
GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
MODEL = 'llama3-8b-8192'


def summarize_with_groq(articles_text: str):
    """Call Groq API to summarize given text into 5 bullet points."""
    if not GROQ_API_KEY:
        return local_summary(articles_text)

    prompt = "Summarize these news headlines in exactly 5 concise bullet points. Start each with •\n\n" + articles_text
    headers = {
        'Authorization': f'Bearer {GROQ_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        'model': MODEL,
        'messages': [
            {'role': 'system', 'content': 'You summarize news headlines into concise bullet points.'},
            {'role': 'user', 'content': prompt},
        ],
        'max_tokens': 300,
    }
    try:
        resp = requests.post(GROQ_URL, json=payload, headers=headers, timeout=5)
    except requests.exceptions.Timeout:
        # EDGE CASE: handles Groq API timeout
        raise

    if resp.status_code >= 400:
        return local_summary(articles_text)

    data = resp.json()
    return data.get('choices', [{}])[0].get('message', {}).get('content') or local_summary(articles_text)


def local_summary(articles_text: str):
    headlines = [line.strip() for line in articles_text.splitlines() if line.strip()]
    if not headlines:
        return '• No headlines available to summarize.'

    bullets = headlines[:5]
    while len(bullets) < 5:
        bullets.append('More headlines are needed for a fuller summary.')
    return '\n'.join(f'• {headline}' for headline in bullets)
