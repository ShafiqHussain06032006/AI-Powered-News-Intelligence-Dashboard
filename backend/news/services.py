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
    # If NEWS_API_KEY is not configured, return demo data for local development
    if not NEWS_API_KEY:
        class MockResp:
            status_code = 200
            def json(self):
                return {
                    'status': 'ok',
                    'totalResults': 2,
                    'articles': [
                        {
                            'source': {'name': 'Demo Source'},
                            'author': 'Demo Author',
                            'title': f"Demo article about {params.get('q','news')}",
                            'description': 'This is a demo article because NEWS_API_KEY is not set.',
                            'url': 'https://example.com/demo-article',
                            'urlToImage': '',
                            'publishedAt': '2026-05-21T12:00:00Z',
                        },
                        {
                            'source': {'name': 'Demo Source 2'},
                            'author': 'Demo Author 2',
                            'title': f"Second demo about {params.get('q','news')}",
                            'description': 'Second demo article.',
                            'url': 'https://example.com/demo-article-2',
                            'urlToImage': '',
                            'publishedAt': '2026-05-20T08:00:00Z',
                        }
                    ]
                }
        return MockResp()

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
