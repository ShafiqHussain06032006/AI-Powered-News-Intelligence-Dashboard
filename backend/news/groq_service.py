import requests
from decouple import config

GROQ_API_KEY = config('GROQ_API_KEY', default='')
GROQ_URL = 'https://api.groq.ai/v1'
MODEL = 'llama3-8b-8192'


def summarize_with_groq(articles_text: str):
    """Call Groq API to summarize given text into 5 bullet points."""
    prompt = "Summarize these news headlines in exactly 5 concise bullet points. Start each with •\n\n" + articles_text
    headers = {
        'Authorization': f'Bearer {GROQ_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        'model': MODEL,
        'prompt': prompt,
        'max_tokens': 300,
    }
    try:
        resp = requests.post(f"{GROQ_URL}/generate", json=payload, headers=headers, timeout=5)
    except requests.exceptions.Timeout:
        # EDGE CASE: handles Groq API timeout
        raise

    if resp.status_code >= 500:
        # upstream error
        raise Exception('groq_upstream')

    data = resp.json()
    # Groq returns generated text under 'text' or similar depending on API
    text = data.get('text') or data.get('output') or ''
    return text
