from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import SearchSerializer
from .services import fetch_news
import requests


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
        results.append({
            'title': a.get('title'),
            'description': a.get('description'),
            'url': a.get('url'),
            'urlToImage': a.get('urlToImage'),
            'source': a.get('source', {}).get('name'),
            'publishedAt': a.get('publishedAt'),
        })

    return JsonResponse({'articles': results, 'totalResults': data.get('totalResults', 0)})
