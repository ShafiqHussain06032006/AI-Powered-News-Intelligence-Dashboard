import requests
from decouple import config

GNEWS_API_KEY = config('GNEWS_API_KEY', default='')
GNEWS_BASE = 'https://gnews.io/api/v4'


def _demo_response(params):
    class MockResp:
        status_code = 200

        def json(self):
            topic = params.get('q') or params.get('country') or 'news'
            return {
                'status': 'ok',
                'totalResults': 2,
                'articles': [
                    {
                        'source': {'name': 'Demo Source'},
                        'author': 'Demo Author',
                        'title': f"Demo article about {topic}",
                        'description': 'This is demo content because live GNews data is unavailable.',
                        'url': 'https://example.com/demo-article',
                        'urlToImage': '',
                        'publishedAt': '2026-05-21T12:00:00Z',
                    },
                    {
                        'source': {'name': 'Demo Source 2'},
                        'author': 'Demo Author 2',
                        'title': f"Second demo about {topic}",
                        'description': 'Second demo article.',
                        'url': 'https://example.com/demo-article-2',
                        'urlToImage': '',
                        'publishedAt': '2026-05-20T08:00:00Z',
                    }
                ]
            }

    return MockResp()


def fetch_news(params: dict):
    """Fetch news from GNews with timeout and a NewsAPI-compatible response shape."""
    params = params.copy()

    if not GNEWS_API_KEY:
        return _demo_response(params)

    endpoint = 'top-headlines' if params.get('category') or not params.get('q') else 'search'
    request_params = {
        'apikey': GNEWS_API_KEY,
        'lang': 'en',
        'max': params.pop('pageSize', 10),
    }
    for key in ('q', 'country', 'category', 'from'):
        if params.get(key):
            request_params[key] = params[key]

    try:
        resp = requests.get(f"{GNEWS_BASE}/{endpoint}", params=request_params, timeout=5)
    except requests.exceptions.Timeout:
        # EDGE CASE: handles request timeout
        raise

    try:
        if resp.status_code in (401, 403):
            return _demo_response(params)
        if resp.status_code == 200:
            return _GNewsResponse(resp.json())
    except ValueError:
        pass

    return resp


class _GNewsResponse:
    status_code = 200

    def __init__(self, data):
        self._data = data
        self.headers = {}

    def json(self):
        articles = []
        for article in self._data.get('articles', []):
            articles.append({
                'source': article.get('source') or {},
                'author': None,
                'title': article.get('title'),
                'description': article.get('description') or article.get('content'),
                'url': article.get('url'),
                'urlToImage': article.get('image'),
                'publishedAt': article.get('publishedAt'),
            })

        return {
            'status': 'ok',
            'totalResults': self._data.get('totalArticles', len(articles)),
            'articles': articles,
        }
