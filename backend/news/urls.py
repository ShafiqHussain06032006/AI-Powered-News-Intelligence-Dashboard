from django.urls import path
from . import views

urlpatterns = [
    path('ping/', views.ping, name='ping'),
    path('search/', views.search_news, name='news-search'),
    path('summarize/', views.summarize_news, name='news-summarize'),
    path('trending/', views.trending_keywords, name='news-trending'),
    path('compare/', views.compare_news, name='news-compare'),
]
