# Nocturne Forge – Game Studio Website (white-label)

Full-stack website for an independent video game development studio: own game portfolio,
B2B co-development & console porting services, careers with transparent salaries and
publisher / press inquiries. All user-facing copy is in Slovak; code and docs are in English.

| Part | Stack |
| --- | --- |
| `backend/` | Python 3, Django 6, Django REST Framework, django-filter, django-cors-headers, Pillow |
| `frontend/` | Angular 22 (standalone components, Signals, `httpResource`, strict TypeScript), pure SCSS |

```
.
├── backend/
│   ├── config/                  # Django project (settings read from .env)
│   └── studio/                  # models, admin, serializers, filters, API views, tests
│       └── management/commands/seed_data.py
└── frontend/
    └── src/
        ├── styles/              # _variables, _mixins, _typography, _theme, _base, _components
        ├── environments/        # apiUrl per build configuration
        └── app/
            ├── core/config/site.config.ts   # ← all white-label branding & business data
            ├── core/                         # models, API service, stores, utils
            ├── shared/components/            # navbar, footer, game card, estimator, lightbox, forms
            └── pages/                        # home, games, game detail, services, careers, contact
```

## Quick start

### 1. Backend (http://localhost:8000)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # optional – sensible dev defaults are built in
python manage.py migrate
python manage.py seed_data         # idempotent demo content (4 games, 4 services, 5 jobs)
python manage.py createsuperuser   # for /admin
python manage.py runserver
```

- Admin (Slovak UI): http://localhost:8000/admin/
- Browsable API: http://localhost:8000/api/
- Tests: `python manage.py test studio`

`seed_data --flush` additionally deletes all job applications and inquiries.

### 2. Frontend (http://localhost:4200)

```bash
cd frontend
npm install                        # .npmrc enables legacy-peer-deps
npm start                          # ng serve
```

The dev build calls the API at `http://localhost:8000/api` (`src/environments/environment.ts`).
The production build (`npm run build`) uses `/api`, i.e. it expects Django behind the same domain
(reverse proxy). Change `environment.production.ts` if the API lives elsewhere.

> If port 8000 is taken on your machine, run `python manage.py runserver 8001` and change
> `apiUrl` in `environment.ts` accordingly.

## API

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/api/games/` | filters: `status` (`vydane`, `vo_vyvoji`, `early_access`, `oznamene`), `platform` (`pc`, `ps5`, `xbox`, `switch`), `featured`, `engine_used`, `search` (title / genre / tagline), `ordering` |
| GET | `/api/games/<slug>/` | full dossier incl. `screenshots`, `key_features`, `awards` |
| GET | `/api/services/` | B2B co-development & porting services |
| GET | `/api/jobs/` | active openings only; filters: `department`, `seniority`, `search`, `ordering` |
| POST | `/api/applications/` | `job`, `applicant_name`, `email`, `phone`, `portfolio_url`, `cover_note`, `gdpr_consent` |
| POST | `/api/inquiries/` | `inquiry_type`, `company_name`, `contact_name`, `email`, `budget_or_scope`, `message`, `gdpr_consent` |

Validation errors are returned in Slovak. The POST endpoints are rate limited
(`API_SUBMISSION_THROTTLE`, default `10/hour` per IP).

## White-label rebranding

1. **Business data & branding** – edit `frontend/src/app/core/config/site.config.ts`
   (studio name, wordmark, tagline, emails, phone, address, IČO / DIČ / IČ DPH,
   platform programs, social links, trust metrics, leadership, career perks, press quotes).
2. **Colours & fonts** – edit the CSS custom properties in `frontend/src/styles/_theme.scss`
   (SCSS tokens live in `_variables.scss`). Google Fonts are linked in `src/index.html`.
3. **Content** – games, services and jobs are managed in Django admin; the demo content
   comes from `seed_data.py`.
4. **Estimator pricing** – rates, multipliers and team compositions are in
   `frontend/src/app/shared/components/co-dev-scope-estimator/estimator.model.ts`.

## Production notes

- Set `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, `DJANGO_ALLOWED_HOSTS`,
  `CORS_ALLOWED_ORIGINS` and `DATABASE_URL` (e.g. `postgres://…`) in `.env`;
  install a PostgreSQL driver (`pip install "psycopg[binary]"`).
- `python manage.py collectstatic` and serve `staticfiles/` (admin assets) via your web server.
- Serve `frontend/dist/frontend/browser` as static files with an SPA fallback to `index.html`.

Demo imagery is loaded from Unsplash; studio names, people, quotes and figures in the
seed data and `site.config.ts` are fictional placeholders.
