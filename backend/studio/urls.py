from rest_framework.routers import DefaultRouter

from .views import (
    BusinessInquiryViewSet,
    GameProjectViewSet,
    JobApplicationViewSet,
    JobOpeningViewSet,
    StudioServiceViewSet,
)

router = DefaultRouter()
router.register("games", GameProjectViewSet, basename="game")
router.register("services", StudioServiceViewSet, basename="service")
router.register("jobs", JobOpeningViewSet, basename="job")
router.register("applications", JobApplicationViewSet, basename="application")
router.register("inquiries", BusinessInquiryViewSet, basename="inquiry")

urlpatterns = router.urls
