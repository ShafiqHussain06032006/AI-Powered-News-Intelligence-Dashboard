from django.test import TestCase, Client
from unittest.mock import patch, Mock
import requests


class NewsAPIEdgeTests(TestCase):
    def setUp(self):
        self.client = Client()

    @patch('news.services.requests.get')
    def test_search_timeout(self, mock_get):
        mock_get.side_effect = requests.exceptions.Timeout()
        resp = self.client.get('/api/news/search/', {'q': 'AI'})
        self.assertEqual(resp.status_code, 504)
        self.assertIn('timeout', resp.json().get('error'))

    @patch('news.services.requests.get')
    def test_search_rate_limit(self, mock_get):
        mock_resp = Mock()
        mock_resp.status_code = 429
        mock_resp.headers = {'Retry-After': '30'}
        mock_resp.json.return_value = {'status': 'error', 'code': 'rateLimited', 'message': 'Too many requests'}
        mock_get.return_value = mock_resp
        resp = self.client.get('/api/news/search/', {'q': 'AI'})
        self.assertEqual(resp.status_code, 429)
        self.assertEqual(resp.json().get('error'), 'rate_limit')

    def test_search_bad_input(self):
        resp = self.client.get('/api/news/search/', {'q': ''})
        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.json().get('error'), 'bad_input')
