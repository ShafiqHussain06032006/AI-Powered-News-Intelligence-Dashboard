from rest_framework import serializers
from datetime import datetime

ALLOWED_CATEGORIES = ['business', 'technology', 'sports', 'health', 'science', 'entertainment']


class SearchSerializer(serializers.Serializer):
    q = serializers.CharField(required=True, max_length=500)
    country = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField(required=False, allow_blank=True)
    from_date = serializers.DateField(required=False)
    page = serializers.IntegerField(required=False, min_value=1)

    def validate_q(self, value):
        if not value.strip():
            raise serializers.ValidationError('Search query cannot be empty.')
        return value.strip()

    def validate_category(self, value):
        if value and value not in ALLOWED_CATEGORIES:
            raise serializers.ValidationError(f'Invalid category. Allowed: {ALLOWED_CATEGORIES}')
        return value

    def validate_from_date(self, value):
        if value and value > datetime.utcnow().date():
            raise serializers.ValidationError('from_date cannot be in the future')
        return value
