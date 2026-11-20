import django_filters
from django.db.models import TextField
from django.db.models.functions import Cast

from .models import GameProject, JobOpening

# Short platform codes used by the frontend mapped to substrings of stored platform labels.
PLATFORM_KEYWORDS = {
    "pc": "PC",
    "ps5": "PlayStation",
    "playstation": "PlayStation",
    "xbox": "Xbox",
    "switch": "Switch",
}


class GameProjectFilter(django_filters.FilterSet):
    platform = django_filters.CharFilter(method="filter_platform", label="Platforma (pc, ps5, xbox, switch)")
    featured = django_filters.BooleanFilter(field_name="is_featured", label="Iba zvýraznené")

    class Meta:
        model = GameProject
        fields = ["status", "engine_used", "platform", "featured"]

    def filter_platform(self, queryset, name, value):
        keyword = PLATFORM_KEYWORDS.get(value.strip().lower(), value.strip())
        if not keyword:
            return queryset
        return queryset.annotate(platforms_text=Cast("platforms", TextField())).filter(
            platforms_text__icontains=keyword
        )


class JobOpeningFilter(django_filters.FilterSet):
    class Meta:
        model = JobOpening
        fields = ["department", "seniority"]
