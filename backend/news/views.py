from django.http import JsonResponse


def ping(request):
    """Simple health check endpoint"""
    return JsonResponse({"status": "ok"})
