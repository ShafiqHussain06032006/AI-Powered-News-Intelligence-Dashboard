import requests
from decouple import config

NEWS_API_KEY = config('NEWS_API_KEY', default='')
NEWSAPI_BASE = 'https://newsapi.org/v2'


def fetch_news(params: dict):
    """Fetch news from NewsAPI with timeout and error mapping."""
    # Choose endpoint based on presence of country/category
    endpoint = 'top-headlines' if params.get('country') or params.get('category') else 'everything'
    url = f"{NEWSAPI_BASE}/{endpoint}"
    headers = {}
    params = params.copy()
    params['apiKey'] = NEWS_API_KEY
    try:
        resp = requests.get(url, params=params, timeout=5)
    except requests.exceptions.Timeout:
        # EDGE CASE: handles request timeout
        raise

    # Map HTTP and API errors up to caller
    return resp
