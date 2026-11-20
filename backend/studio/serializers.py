from urllib.parse import urlparse

from rest_framework import serializers

from .models import (
    BusinessInquiry,
    GameProject,
    GameScreenshot,
    JobApplication,
    JobOpening,
    StudioService,
)


class GameScreenshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameScreenshot
        fields = ["id", "image_url", "caption", "display_order"]


class GameProjectListSerializer(serializers.ModelSerializer):
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = GameProject
        fields = [
            "id", "title", "tagline", "slug", "status", "status_label", "genre",
            "engine_used", "platforms", "release_date_label", "steam_url",
            "awards", "cover_image_url", "hero_banner_url", "is_featured", "display_order",
        ]


class GameProjectDetailSerializer(GameProjectListSerializer):
    screenshots = GameScreenshotSerializer(many=True, read_only=True)

    class Meta(GameProjectListSerializer.Meta):
        fields = GameProjectListSerializer.Meta.fields + [
            "trailer_url", "synopsis", "key_features", "screenshots",
        ]


class StudioServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudioService
        fields = ["id", "title", "slug", "short_description", "deliverables", "engines_supported", "display_order"]


class JobOpeningSerializer(serializers.ModelSerializer):
    department_label = serializers.CharField(source="get_department_display", read_only=True)

    class Meta:
        model = JobOpening
        fields = [
            "id", "title", "department", "department_label", "location", "seniority",
            "description", "requirements", "benefits", "salary_from_eur", "created_at",
        ]


def _validate_http_url(value: str) -> str:
    if urlparse(value).scheme not in {"http", "https"}:
        raise serializers.ValidationError("Odkaz musí začínať na http:// alebo https://.")
    return value


class GdprConsentMixin(serializers.Serializer):
    gdpr_consent = serializers.BooleanField(write_only=True)

    def validate_gdpr_consent(self, value: bool) -> bool:
        if not value:
            raise serializers.ValidationError("Na odoslanie je potrebný súhlas so spracovaním osobných údajov.")
        return value

    def create(self, validated_data):
        validated_data.pop("gdpr_consent", None)
        return super().create(validated_data)


class JobApplicationSerializer(GdprConsentMixin, serializers.ModelSerializer):
    job = serializers.PrimaryKeyRelatedField(
        queryset=JobOpening.objects.filter(is_active=True),
        error_messages={
            "does_not_exist": "Vybraná pozícia už nie je aktívna alebo neexistuje.",
            "required": "Vyberte pozíciu, na ktorú reagujete.",
        },
    )

    class Meta:
        model = JobApplication
        fields = ["id", "job", "applicant_name", "email", "phone", "portfolio_url", "cover_note", "gdpr_consent", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_applicant_name(self, value: str) -> str:
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("Zadajte celé meno a priezvisko.")
        return value

    def validate_phone(self, value: str) -> str:
        cleaned = value.replace(" ", "")
        if cleaned and not cleaned.lstrip("+").isdigit():
            raise serializers.ValidationError("Telefónne číslo môže obsahovať iba číslice, medzery a znak +.")
        if cleaned and len(cleaned.lstrip("+")) < 9:
            raise serializers.ValidationError("Telefónne číslo je príliš krátke.")
        return value.strip()

    def validate_portfolio_url(self, value: str) -> str:
        return _validate_http_url(value)

    def validate_cover_note(self, value: str) -> str:
        if len(value) > 4000:
            raise serializers.ValidationError("Motivačná správa môže mať najviac 4 000 znakov.")
        return value.strip()


class BusinessInquirySerializer(GdprConsentMixin, serializers.ModelSerializer):
    class Meta:
        model = BusinessInquiry
        fields = [
            "id", "inquiry_type", "company_name", "contact_name", "email",
            "budget_or_scope", "message", "gdpr_consent", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_contact_name(self, value: str) -> str:
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("Zadajte meno kontaktnej osoby.")
        return value

    def validate_message(self, value: str) -> str:
        value = value.strip()
        if len(value) < 20:
            raise serializers.ValidationError("Opíšte prosím váš dopyt aspoň v 20 znakoch.")
        if len(value) > 5000:
            raise serializers.ValidationError("Správa môže mať najviac 5 000 znakov.")
        return value

    def validate(self, attrs):
        inquiry_type = attrs.get("inquiry_type")
        if inquiry_type in {BusinessInquiry.InquiryType.CO_DEVELOPMENT, BusinessInquiry.InquiryType.PUBLISHING} and not attrs.get("company_name", "").strip():
            raise serializers.ValidationError({"company_name": "Pri B2B a vydavateľskom dopyte uveďte názov spoločnosti."})
        return attrs
