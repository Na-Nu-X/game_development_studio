from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify


def unique_slugify(instance: models.Model, value: str, slug_field: str = "slug") -> str:
    """Return a slug derived from `value` that is unique for the model."""
    base = slugify(value)[:200] or "polozka"
    slug = base
    model = instance.__class__
    counter = 2
    while model.objects.filter(**{slug_field: slug}).exclude(pk=instance.pk).exists():
        slug = f"{base}-{counter}"
        counter += 1
    return slug


def validate_string_list(value):
    if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
        raise ValidationError("Hodnota musí byť zoznam textových položiek, napr. [\"PC (Steam)\"].")


class TimestampedModel(models.Model):
    created_at = models.DateTimeField("Vytvorené", auto_now_add=True)

    class Meta:
        abstract = True


# --------------------------------------------------------------------------- #
# Game portfolio
# --------------------------------------------------------------------------- #
class GameProject(models.Model):
    class Status(models.TextChoices):
        RELEASED = "vydane", "Vydané"
        IN_DEVELOPMENT = "vo_vyvoji", "Vo vývoji"
        EARLY_ACCESS = "early_access", "Predbežný prístup"
        ANNOUNCED = "oznamene", "Oznámené"

    class Engine(models.TextChoices):
        UNREAL_5 = "Unreal Engine 5", "Unreal Engine 5"
        UNITY = "Unity", "Unity"
        CUSTOM = "Vlastný C++ Engine", "Vlastný C++ Engine"

    title = models.CharField("Názov hry", max_length=160)
    tagline = models.CharField("Podtitul / tagline", max_length=255)
    slug = models.SlugField("URL slug", max_length=220, unique=True, blank=True)
    status = models.CharField("Stav vývoja", max_length=20, choices=Status.choices, default=Status.IN_DEVELOPMENT)
    genre = models.CharField("Žáner", max_length=120)
    engine_used = models.CharField("Engine", max_length=40, choices=Engine.choices, default=Engine.UNREAL_5)
    platforms = models.JSONField(
        "Platformy", default=list, blank=True, validators=[validate_string_list],
        help_text='Zoznam platforiem, napr. ["PC (Steam)", "PlayStation 5", "Xbox Series X|S", "Nintendo Switch"]',
    )
    release_date_label = models.CharField("Termín vydania", max_length=60, help_text="Napr. Q4 2026 alebo Jeseň 2025")
    steam_url = models.URLField("Odkaz na Steam", blank=True)
    trailer_url = models.URLField("Odkaz na trailer", blank=True)
    synopsis = models.TextField("Synopsa")
    key_features = models.JSONField("Kľúčové herné prvky", default=list, blank=True, validators=[validate_string_list])
    awards = models.JSONField("Ocenenia a nominácie", default=list, blank=True, validators=[validate_string_list])
    cover_image_url = models.URLField("Obálka (key art)", max_length=500)
    hero_banner_url = models.URLField("Hero banner", max_length=500)
    is_featured = models.BooleanField("Zvýraznená hra", default=False)
    display_order = models.PositiveIntegerField("Poradie zobrazenia", default=0)

    class Meta:
        verbose_name = "Herný titul"
        verbose_name_plural = "Herné tituly"
        ordering = ["display_order", "title"]

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slugify(self, self.title)
        super().save(*args, **kwargs)


class GameScreenshot(models.Model):
    game = models.ForeignKey(GameProject, verbose_name="Hra", related_name="screenshots", on_delete=models.CASCADE)
    image_url = models.URLField("URL obrázka", max_length=500)
    caption = models.CharField("Popis", max_length=255, blank=True)
    display_order = models.PositiveIntegerField("Poradie", default=0)

    class Meta:
        verbose_name = "Screenshot"
        verbose_name_plural = "Galéria screenshotov"
        ordering = ["display_order", "id"]

    def __str__(self) -> str:
        return f"{self.game.title} – {self.caption or self.pk}"


# --------------------------------------------------------------------------- #
# B2B services
# --------------------------------------------------------------------------- #
class StudioService(models.Model):
    title = models.CharField("Názov služby", max_length=180)
    slug = models.SlugField("URL slug", max_length=220, unique=True, blank=True)
    short_description = models.TextField("Krátky popis")
    deliverables = models.JSONField("Výstupy / deliverables", default=list, blank=True, validators=[validate_string_list])
    engines_supported = models.JSONField("Podporované enginy", default=list, blank=True, validators=[validate_string_list])
    display_order = models.PositiveIntegerField("Poradie zobrazenia", default=0)

    class Meta:
        verbose_name = "B2B služba"
        verbose_name_plural = "B2B služby & Co-Development"
        ordering = ["display_order", "title"]

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slugify(self, self.title)
        super().save(*args, **kwargs)


# --------------------------------------------------------------------------- #
# Careers
# --------------------------------------------------------------------------- #
class JobOpening(TimestampedModel):
    class Department(models.TextChoices):
        PROGRAMMING = "programovanie", "Programovanie"
        ART = "art_animacie", "Art & Animácie"
        DESIGN = "dizajn", "Game Dizajn"
        PRODUCTION = "produkcia", "Produkcia & QA"

    class Seniority(models.TextChoices):
        SENIOR = "Senior", "Senior"
        MEDIOR = "Medior", "Medior"
        JUNIOR = "Junior", "Junior"

    title = models.CharField("Názov pozície", max_length=160)
    department = models.CharField("Oddelenie", max_length=20, choices=Department.choices)
    location = models.CharField("Miesto výkonu práce", max_length=120)
    seniority = models.CharField("Seniorita", max_length=10, choices=Seniority.choices)
    description = models.TextField("Popis pozície")
    requirements = models.JSONField("Požiadavky", default=list, blank=True, validators=[validate_string_list])
    benefits = models.JSONField("Benefity", default=list, blank=True, validators=[validate_string_list])
    salary_from_eur = models.PositiveIntegerField(
        "Základná mzda od (€ / mesiac, brutto)",
        validators=[MinValueValidator(1)],
        help_text="Povinný údaj o základnej zložke mzdy podľa zákona o službách zamestnanosti.",
    )
    is_active = models.BooleanField("Aktívna pozícia", default=True)

    class Meta:
        verbose_name = "Pracovná pozícia"
        verbose_name_plural = "Otvorené pracovné pozície"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.title} ({self.get_seniority_display()})"


class JobApplication(TimestampedModel):
    job = models.ForeignKey(JobOpening, verbose_name="Pozícia", related_name="applications", on_delete=models.CASCADE)
    applicant_name = models.CharField("Meno a priezvisko", max_length=160)
    email = models.EmailField("E-mail")
    phone = models.CharField("Telefón", max_length=40, blank=True)
    portfolio_url = models.URLField("Portfólio (ArtStation / GitHub / LinkedIn / itch.io)", max_length=500)
    cover_note = models.TextField("Motivačná správa", blank=True)
    is_reviewed = models.BooleanField("Posúdené", default=False)

    class Meta:
        verbose_name = "Reakcia na pozíciu"
        verbose_name_plural = "Reakcie na pozície"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.applicant_name} → {self.job.title}"


# --------------------------------------------------------------------------- #
# Business inquiries
# --------------------------------------------------------------------------- #
class BusinessInquiry(TimestampedModel):
    class InquiryType(models.TextChoices):
        CO_DEVELOPMENT = "co_development", "Co-development & Vývoj na mieru"
        PUBLISHING = "publishing", "Vydavateľský dopyt (Publisher)"
        PRESS = "press", "Médiá a Press Kit"
        OTHER = "ine", "Iný dopyt"

    inquiry_type = models.CharField("Typ dopytu", max_length=20, choices=InquiryType.choices, default=InquiryType.CO_DEVELOPMENT)
    company_name = models.CharField("Spoločnosť / médium", max_length=160, blank=True)
    contact_name = models.CharField("Kontaktná osoba", max_length=160)
    email = models.EmailField("E-mail")
    budget_or_scope = models.CharField("Rozpočet / rozsah", max_length=255, blank=True)
    message = models.TextField("Správa")
    is_processed = models.BooleanField("Vybavené", default=False)

    class Meta:
        verbose_name = "Obchodný dopyt"
        verbose_name_plural = "Obchodné dopyty (B2B / Publisher / Médiá)"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.get_inquiry_type_display()} – {self.contact_name}"
