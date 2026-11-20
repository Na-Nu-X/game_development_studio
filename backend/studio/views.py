from rest_framework import mixins, viewsets
from rest_framework.throttling import ScopedRateThrottle

from .filters import GameProjectFilter, JobOpeningFilter
from .models import BusinessInquiry, GameProject, JobApplication, JobOpening, StudioService
from .serializers import (
    BusinessInquirySerializer,
    GameProjectDetailSerializer,
    GameProjectListSerializer,
    JobApplicationSerializer,
    JobOpeningSerializer,
    StudioServiceSerializer,
)


class GameProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """Studio game portfolio. Detail is addressed by slug."""

    lookup_field = "slug"
    filterset_class = GameProjectFilter
    search_fields = ["title", "genre", "tagline"]
    ordering_fields = ["display_order", "title", "release_date_label"]
    ordering = ["display_order", "title"]

    def get_queryset(self):
        qs = GameProject.objects.all()
        if self.action == "retrieve":
            qs = qs.prefetch_related("screenshots")
        return qs

    def get_serializer_class(self):
        return GameProjectDetailSerializer if self.action == "retrieve" else GameProjectListSerializer


class StudioServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StudioService.objects.all()
    serializer_class = StudioServiceSerializer
    lookup_field = "slug"
    filter_backends = []


class JobOpeningViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = JobOpening.objects.filter(is_active=True)
    serializer_class = JobOpeningSerializer
    filterset_class = JobOpeningFilter
    search_fields = ["title", "description", "location"]
    ordering_fields = ["created_at", "salary_from_eur", "title"]
    ordering = ["-created_at"]


class FormSubmissionThrottleMixin:
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "submissions"


class JobApplicationViewSet(FormSubmissionThrottleMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    filter_backends = []


class BusinessInquiryViewSet(FormSubmissionThrottleMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = BusinessInquiry.objects.all()
    serializer_class = BusinessInquirySerializer
    filter_backends = []
