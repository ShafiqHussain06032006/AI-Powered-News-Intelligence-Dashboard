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

    # If NewsAPI returns a JSON with an error code, bubble it up
    try:
        data = resp.json()
        code = data.get('code')
        if code:
            # pass the structured error to caller
            resp._newsapi_code = code
    except ValueError:
        pass

    return resp
