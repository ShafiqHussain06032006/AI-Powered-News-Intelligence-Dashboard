from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import SearchSerializer
from .services import fetch_news
import requests
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()
from .groq_service import summarize_with_groq
import nltk
from collections import Counter

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

from nltk.corpus import stopwords
STOPWORDS = set(stopwords.words('english'))


def ping(request):
    """Simple health check endpoint"""
    return JsonResponse({"status": "ok"})


@api_view(['GET'])
def search_news(request):
    """Search news endpoint. Validates input and proxies to NewsAPI."""
    serializer = SearchSerializer(data=request.query_params)
    if not serializer.is_valid():
        return JsonResponse({"error": "bad_input", "message": serializer.errors}, status=400)

    params = serializer.validated_data
    # Build params for NewsAPI
    api_params = {}
    api_params['q'] = params.get('q')
    if params.get('country'):
        api_params['country'] = params.get('country')
    if params.get('category'):
        api_params['category'] = params.get('category')
    if params.get('from_date'):
        api_params['from'] = params.get('from_date').isoformat()
    if params.get('page'):
        api_params['page'] = params.get('page')

    try:
        resp = fetch_news(api_params)
    except requests.exceptions.Timeout:
        # EDGE CASE: handles NewsAPI request timeout
        return JsonResponse({"error": "timeout", "message": "Request timed out. Please try again."}, status=504)

    # Handle upstream errors
    # EDGE CASE: handle NewsAPI structured error codes
    newsapi_code = getattr(resp, '_newsapi_code', None)
    if newsapi_code == 'apiKeyInvalid' or newsapi_code == 'apiKeyMissing':
        return JsonResponse({"error": "apiKeyInvalid", "message": "Invalid API key. Check your .env file."}, status=401)
    if newsapi_code == 'parameterInvalid':
        return JsonResponse({"error": "parameterInvalid", "message": "One or more parameters are invalid."}, status=400)

    if resp.status_code == 429:
        # EDGE CASE: handles NewsAPI 429 rate limit response
        retry_after = resp.headers.get('Retry-After') or 60
        return JsonResponse({"error": "rate_limit", "message": "Too many requests. Try again in 60 seconds.", "retry_after": int(retry_after)}, status=429)

    if resp.status_code >= 500:
        return JsonResponse({"error": "upstream_error", "message": "News service unavailable."}, status=503)

    if resp.status_code == 401:
        return JsonResponse({"error": "apiKeyInvalid", "message": "Invalid API key. Check your .env file."}, status=401)

    data = resp.json()
    articles = data.get('articles', [])
    # Return a compact list of articles
    results = []
    for a in articles:
        text = ' '.join(filter(None, [a.get('title'), a.get('description')]))
        vs = analyzer.polarity_scores(text)
        compound = vs.get('compound', 0.0)
        if compound >= 0.05:
            label = 'positive'
        elif compound <= -0.05:
            label = 'negative'
        else:
            label = 'neutral'

        results.append({
            'title': a.get('title'),
            'description': a.get('description'),
            'url': a.get('url'),
            'urlToImage': a.get('urlToImage'),
            'source': a.get('source', {}).get('name'),
            'publishedAt': a.get('publishedAt'),
            'sentiment': {'label': label, 'score': round(compound, 3)},
        })

    return JsonResponse({'articles': results, 'totalResults': data.get('totalResults', 0)})


@api_view(['POST'])
def summarize_news(request):
    body = request.data
    articles = body.get('articles')
    if not articles:
        return JsonResponse({"error": "bad_input", "message": "Articles list required."}, status=400)

    # Combine headlines for summarization
    text = '\n'.join([a.get('title', '') for a in articles])
    try:
        summary = summarize_with_groq(text)
    except requests.exceptions.Timeout:
        return JsonResponse({"error": "timeout", "message": "Request timed out. Please try again."}, status=504)
    except Exception:
        return JsonResponse({"error": "upstream_error", "message": "AI summarization service unavailable."}, status=503)

    return JsonResponse({'summary': summary})


@api_view(['GET'])
def trending_keywords(request):
    # Fetch top 20 latest headlines (no query)
    try:
        resp = fetch_news({'pageSize': 20})
    except requests.exceptions.Timeout:
        return JsonResponse({"error": "timeout", "message": "Request timed out. Please try again."}, status=504)

    if resp.status_code != 200:
        return JsonResponse({"error": "upstream_error", "message": "News service unavailable."}, status=503)

    data = resp.json()
    articles = data.get('articles', [])
    words = []
    for a in articles:
        for chunk in [a.get('title',''), a.get('description','')]:
            for w in (chunk or '').split():
                w_clean = ''.join(ch for ch in w if ch.isalpha())
                w_lower = w_clean.lower()
                if len(w_lower) > 2 and w_lower not in STOPWORDS:
                    words.append(w_lower)

    counts = Counter(words)
    top = counts.most_common(8)
    result = [{'word': w.title(), 'count': c} for w, c in top]
    return JsonResponse({'keywords': result})


@api_view(['GET'])
def compare_news(request):
    q = request.query_params.get('q')
    countries = request.query_params.get('countries')
    if not q:
        return JsonResponse({"error": "bad_input", "message": "Search query cannot be empty."}, status=400)
    if not countries:
        return JsonResponse({"error": "bad_input", "message": "countries param required."}, status=400)

    country_list = [c.strip() for c in countries.split(',') if c.strip()]
    output = {}
    for c in country_list:
        try:
            resp = fetch_news({'q': q, 'country': c, 'pageSize': 5})
        except requests.exceptions.Timeout:
            output[c] = {'error': 'timeout'}
            continue

        if resp.status_code != 200:
            output[c] = {'error': 'upstream'}
            continue

        data = resp.json()
        output[c] = data.get('articles', [])

    return JsonResponse({'compare': output})
