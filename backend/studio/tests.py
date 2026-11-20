from django.core.management import call_command
from django.test import TestCase
from rest_framework.test import APIClient

from .models import BusinessInquiry, GameProject, JobApplication, JobOpening


class StudioApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_data", verbosity=0)

    def setUp(self):
        self.client = APIClient()

    def test_seed_is_idempotent(self):
        call_command("seed_data", verbosity=0)
        self.assertEqual(GameProject.objects.count(), 4)
        self.assertEqual(JobOpening.objects.count(), 5)

    def test_games_list_and_filters(self):
        self.assertEqual(len(self.client.get("/api/games/").json()), 4)
        released = self.client.get("/api/games/", {"status": "vydane"}).json()
        self.assertTrue(released and all(g["status"] == "vydane" for g in released))
        switch = self.client.get("/api/games/", {"platform": "switch"}).json()
        self.assertEqual([g["slug"] for g in switch], ["ticha-morena"])
        search = self.client.get("/api/games/", {"search": "survival"}).json()
        self.assertEqual([g["slug"] for g in search], ["zona-zero"])

    def test_game_detail_includes_screenshots(self):
        data = self.client.get("/api/games/ashen-meridian/").json()
        self.assertGreater(len(data["screenshots"]), 0)
        self.assertIn("key_features", data)

    def test_jobs_only_active(self):
        JobOpening.objects.filter(seniority="Junior").update(is_active=False)
        jobs = self.client.get("/api/jobs/").json()
        self.assertEqual(len(jobs), 4)
        programming = self.client.get("/api/jobs/", {"department": "programovanie"}).json()
        self.assertTrue(all(j["department"] == "programovanie" for j in programming))

    def test_application_validation_and_create(self):
        job = JobOpening.objects.first()
        bad = self.client.post("/api/applications/", {
            "job": job.pk, "applicant_name": "A", "email": "x", "portfolio_url": "ftp://x.sk", "gdpr_consent": False,
        }, format="json")
        self.assertEqual(bad.status_code, 400)
        self.assertTrue({"applicant_name", "email", "portfolio_url", "gdpr_consent"} <= set(bad.json()))

        ok = self.client.post("/api/applications/", {
            "job": job.pk, "applicant_name": "Jana Nováková", "email": "jana@example.com",
            "portfolio_url": "https://www.artstation.com/jana", "gdpr_consent": True,
        }, format="json")
        self.assertEqual(ok.status_code, 201, ok.json())
        self.assertEqual(JobApplication.objects.count(), 1)

    def test_inquiry_requires_company_for_b2b(self):
        payload = {
            "inquiry_type": "co_development", "contact_name": "Peter Horváth", "email": "peter@example.com",
            "message": "Hľadáme partnera na port našej hry na Nintendo Switch.", "gdpr_consent": True,
        }
        self.assertEqual(self.client.post("/api/inquiries/", payload, format="json").status_code, 400)
        payload["company_name"] = "Example Games s.r.o."
        self.assertEqual(self.client.post("/api/inquiries/", payload, format="json").status_code, 201)
        self.assertEqual(BusinessInquiry.objects.count(), 1)
