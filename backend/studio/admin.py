from django.contrib import admin

from .models import (
    BusinessInquiry,
    GameProject,
    GameScreenshot,
    JobApplication,
    JobOpening,
    StudioService,
)

admin.site.site_header = "Administrácia herného štúdia"
admin.site.site_title = "Štúdio – administrácia"
admin.site.index_title = "Správa hier, služieb, kariéry a dopytov"


class GameScreenshotInline(admin.TabularInline):
    model = GameScreenshot
    extra = 1
    fields = ("image_url", "caption", "display_order")


@admin.register(GameProject)
class GameProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "engine_used", "genre", "release_date_label", "is_featured", "display_order")
    list_editable = ("is_featured", "display_order")
    list_filter = ("status", "engine_used", "is_featured")
    search_fields = ("title", "genre", "tagline")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [GameScreenshotInline]
    fieldsets = (
        ("Základné údaje", {"fields": ("title", "tagline", "slug", "status", "genre", "engine_used", "release_date_label")}),
        ("Platformy a odkazy", {"fields": ("platforms", "steam_url", "trailer_url")}),
        ("Obsah", {"fields": ("synopsis", "key_features", "awards")}),
        ("Vizuály", {"fields": ("cover_image_url", "hero_banner_url")}),
        ("Zobrazenie", {"fields": ("is_featured", "display_order")}),
    )


@admin.register(StudioService)
class StudioServiceAdmin(admin.ModelAdmin):
    list_display = ("title", "display_order")
    list_editable = ("display_order",)
    search_fields = ("title", "short_description")
    prepopulated_fields = {"slug": ("title",)}


class JobApplicationInline(admin.TabularInline):
    model = JobApplication
    extra = 0
    fields = ("applicant_name", "email", "portfolio_url", "is_reviewed", "created_at")
    readonly_fields = ("applicant_name", "email", "portfolio_url", "created_at")
    show_change_link = True
    can_delete = False


@admin.register(JobOpening)
class JobOpeningAdmin(admin.ModelAdmin):
    list_display = ("title", "department", "seniority", "location", "salary_display", "is_active", "application_count", "created_at")
    list_editable = ("is_active",)
    list_filter = ("department", "seniority", "is_active")
    search_fields = ("title", "description", "location")
    inlines = [JobApplicationInline]

    @admin.display(description="Mzda od", ordering="salary_from_eur")
    def salary_display(self, obj):
        return f"od {obj.salary_from_eur:,} € / mesiac".replace(",", " ")

    @admin.display(description="Reakcie")
    def application_count(self, obj):
        return obj.applications.count()


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ("applicant_name", "job", "email", "portfolio_url", "is_reviewed", "created_at")
    list_editable = ("is_reviewed",)
    list_filter = ("is_reviewed", "job__department", "job")
    search_fields = ("applicant_name", "email", "job__title")
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"
    actions = ["mark_reviewed"]

    @admin.action(description="Označiť vybrané reakcie ako posúdené")
    def mark_reviewed(self, request, queryset):
        updated = queryset.update(is_reviewed=True)
        self.message_user(request, f"Posúdených reakcií: {updated}")


@admin.register(BusinessInquiry)
class BusinessInquiryAdmin(admin.ModelAdmin):
    list_display = ("contact_name", "company_name", "inquiry_type", "email", "budget_or_scope", "is_processed", "created_at")
    list_editable = ("is_processed",)
    list_filter = ("inquiry_type", "is_processed")
    search_fields = ("contact_name", "company_name", "email", "message")
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"
    actions = ["mark_processed"]

    @admin.action(description="Označiť vybrané dopyty ako vybavené")
    def mark_processed(self, request, queryset):
        updated = queryset.update(is_processed=True)
        self.message_user(request, f"Vybavených dopytov: {updated}")
