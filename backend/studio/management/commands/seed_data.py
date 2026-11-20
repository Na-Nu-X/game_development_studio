"""
Idempotent demo content for the studio website.

Usage:
    python manage.py seed_data            # create or update demo content
    python manage.py seed_data --flush    # also remove applications & inquiries
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from studio.models import (
    BusinessInquiry,
    GameProject,
    GameScreenshot,
    JobApplication,
    JobOpening,
    StudioService,
)


def unsplash(photo_id: str, width: int = 1600) -> str:
    return f"https://images.unsplash.com/photo-{photo_id}?auto=format&fit=crop&w={width}&q=80"


GAMES = [
    {
        "slug": "ashen-meridian",
        "title": "Ashen Meridian",
        "tagline": "Temné akčné RPG o kráľovstve, ktoré zabudlo, ako sa svieti.",
        "status": GameProject.Status.RELEASED,
        "genre": "Akčné RPG",
        "engine_used": GameProject.Engine.UNREAL_5,
        "platforms": ["PC (Steam)", "PlayStation 5", "Xbox Series X|S"],
        "release_date_label": "Jeseň 2025",
        "steam_url": "https://store.steampowered.com/",
        "trailer_url": "https://www.youtube.com/",
        "synopsis": (
            "Meridian kedysi žiaril ako srdce ríše. Dnes ho pokrýva popol z vyhasnutých svätýň a lesy "
            "pohltila hmla, ktorá šepká mená mŕtvych. Ako posledná Strážkyňa plameňa sa vydáš naprieč "
            "zničenými provinciami, aby si znovu zapálila sedem majákov – a rozhodla, komu ich svetlo "
            "naozaj patrí. Ashen Meridian spája precízny súbojový systém s vetviacim sa príbehom, v ktorom "
            "každé rozhodnutie zanecháva v svete trvalú stopu."
        ),
        "key_features": [
            "Vetviaci sa príbeh s 12 koncami",
            "Ray-tracing osvetlenie v Unreal Engine 5 (Lumen & Nanite)",
            "Taktický súbojový systém s parírovaním a zbraňami z popola",
            "Originálny orchestrálny soundtrack nahratý v Bratislave",
            "Viac ako 40 hodín hlavného príbehu a vedľajších úloh",
        ],
        "awards": [
            "Slovak Game of the Year – Najlepší vizuál",
            "CEEGA Finalist – Najlepšia hra roka",
            "Gamescom Indie Arena Booth – Výber poroty",
        ],
        "cover_image_url": unsplash("1518709268805-4e9042af9f23", 1200),
        "hero_banner_url": unsplash("1511884642898-4c92249e20b6", 2400),
        "is_featured": True,
        "display_order": 1,
        "screenshots": [
            ("1511884642898-4c92249e20b6", "Hmlisté údolia Severnej marky"),
            ("1518709268805-4e9042af9f23", "Brána prvého majáka"),
            ("1448375240586-882707db888b", "Šepkajúci les – vedľajšia výprava"),
            ("1418065460487-3e41a6c84dc5", "Úsvit nad Starou cestou"),
            ("1536152470836-b943b246224c", "Popolavé močiare za súmraku"),
        ],
    },
    {
        "slug": "hollow-signal",
        "title": "Hollow Signal",
        "tagline": "Taktická sci-fi stratégia na okraji zmapovaného vesmíru.",
        "status": GameProject.Status.EARLY_ACCESS,
        "genre": "Taktická sci-fi stratégia",
        "engine_used": GameProject.Engine.UNITY,
        "platforms": ["PC (Steam)", "Xbox Series X|S"],
        "release_date_label": "Plné vydanie Q2 2026",
        "steam_url": "https://store.steampowered.com/",
        "trailer_url": "https://www.youtube.com/",
        "synopsis": (
            "Z hlbín pásu Kuiper prichádza signál, ktorý nemal existovať. Velíš poslednej expedičnej "
            "flotile Konzorcia a musíš rozhodnúť, či signál preskúmaš, zničíš, alebo predáš tomu, kto "
            "ponúkne viac. Ťahové súboje na hexagonálnych mapách, správa posádky so zraniteľnými "
            "špecialistami a procedurálne generované sektory robia z každej kampane jedinečný príbeh."
        ),
        "key_features": [
            "Ťahové taktické súboje s deštruovateľným prostredím",
            "Procedurálne generované hviezdne sektory",
            "Permanentná smrť posádky a systém traumy",
            "Pravidelné aktualizácie počas predbežného prístupu",
            "Podpora modov cez Steam Workshop",
        ],
        "awards": [
            "Steam Next Fest – Top 50 najhranejších dem",
            "Game Access Awards – Nominácia za game dizajn",
        ],
        "cover_image_url": unsplash("1614732414444-096e5f1122d5", 1200),
        "hero_banner_url": unsplash("1462331940025-496dfbfc7564", 2400),
        "is_featured": True,
        "display_order": 2,
        "screenshots": [
            ("1462331940025-496dfbfc7564", "Hmlovina Vigil – sektor 7"),
            ("1446776811953-b23d57bd21aa", "Orbitálna stanica Konzorcia"),
            ("1614728894747-a83421e2b9c9", "Plynový obor nad bojiskom"),
            ("1451187580459-43490279c0fa", "Taktická mapa komunikačnej siete"),
            ("1446941611757-91d2c3bd3d45", "Štart expedičnej flotily"),
        ],
    },
    {
        "slug": "ticha-morena",
        "title": "Tichá Morena",
        "tagline": "Atmosférická príbehová adventúra inšpirovaná slovanskými mýtmi.",
        "status": GameProject.Status.RELEASED,
        "genre": "Atmosférická príbehová adventúra",
        "engine_used": GameProject.Engine.CUSTOM,
        "platforms": ["PC (Steam)", "PlayStation 5", "Xbox Series X|S", "Nintendo Switch"],
        "release_date_label": "Jar 2024",
        "steam_url": "https://store.steampowered.com/",
        "trailer_url": "https://www.youtube.com/",
        "synopsis": (
            "V horskej dedine, kde zima nikdy neodišla, hľadá dievča menom Vesna svojho brata. Stopy ju "
            "vedú k Morene – bohyni, ktorú ľudia prestali vynášať z dediny. Tichá Morena je komorný, "
            "ručne vyrozprávaný zážitok o strate a nádeji, postavený na našom vlastnom C++ engine s "
            "volumetrickou hmlou a systémom dynamického snehu."
        ),
        "key_features": [
            "Príbeh inšpirovaný slovenským a slovanským folklórom",
            "Vlastný C++ engine s volumetrickou hmlou a dynamickým snehom",
            "Plný slovenský dabing a titulky v 11 jazykoch",
            "Hádanky prepojené s ľudovými piesňami",
            "Natívna verzia pre Nintendo Switch v 60 FPS (docked)",
        ],
        "awards": [
            "Slovak Game of the Year – Hra roka",
            "CEEGA Finalist – Najlepší príbeh",
            "IndieCade Europe – Oficiálny výber",
        ],
        "cover_image_url": unsplash("1484950763426-56b5bf172dbb", 1200),
        "hero_banner_url": unsplash("1519681393784-d120267933ba", 2400),
        "is_featured": True,
        "display_order": 3,
        "screenshots": [
            ("1519681393784-d120267933ba", "Noc pred Morenou"),
            ("1484950763426-56b5bf172dbb", "Vesna pod hviezdami"),
            ("1534447677768-be436bb09401", "Zamrznuté jazero za úplňku"),
            ("1470813740244-df37b8c1edcb", "Hviezdna roklina pod Zimným štítom"),
            ("1477346611705-65d1883cee1e", "Posledné svetlo v štítoch"),
        ],
    },
    {
        "slug": "zona-zero",
        "title": "Zóna Zero",
        "tagline": "Kooperatívny survival v opustenej megapolis pre 1 – 4 hráčov.",
        "status": GameProject.Status.IN_DEVELOPMENT,
        "genre": "Kooperatívny survival",
        "engine_used": GameProject.Engine.UNREAL_5,
        "platforms": ["PC (Steam)", "PlayStation 5", "Xbox Series X|S"],
        "release_date_label": "Q4 2026",
        "steam_url": "https://store.steampowered.com/",
        "trailer_url": "",
        "synopsis": (
            "Mesto, ktoré nikdy nespalo, sa jedného dňa jednoducho vypol. O dvadsať rokov neskôr sa "
            "vraciaš so skupinou mrchožrútov do Zóny Zero – megapolis, ktorú prevzali rastliny, búrky a "
            "niečo, čo sa skrýva v elektrickej sieti. Buduj základne vo výškových budovách, obnovuj "
            "energetickú sieť štvrť po štvrti a preži noci, keď sa mesto prebúdza."
        ),
        "key_features": [
            "Kooperácia pre 1 – 4 hráčov s dedikovanými servermi",
            "Vertikálne budovanie základní v mrakodrapoch",
            "Dynamické počasie a cyklus dňa a noci v UE5",
            "Systém obnovy energetickej siete mení mapu v reálnom čase",
            "Crossplay medzi PC a konzolami",
        ],
        "awards": [],
        "cover_image_url": unsplash("1519501025264-65ba15a82390", 1200),
        "hero_banner_url": unsplash("1519608487953-e999c86e7455", 2400),
        "is_featured": True,
        "display_order": 4,
        "screenshots": [
            ("1519608487953-e999c86e7455", "Neónová štvrť po zotmení"),
            ("1519501025264-65ba15a82390", "Mrakodrapy centrálnej štvrte"),
            ("1449824913935-59a10b8d2000", "Ulice Zóny Zero"),
            ("1480714378408-67cf0d13bc1b", "Výhľad zo základne v 84. poschodí"),
        ],
    },
]

SERVICES = [
    {
        "slug": "full-cycle-vyvoj-hier",
        "title": "Full-Cycle Vývoj Hier (PC & Konzoly)",
        "short_description": (
            "Od prvého konceptu po zlatú verziu a post-launch podporu. Prevezmeme celú produkciu vašej "
            "hry – dizajn, programovanie, art, audio aj certifikáciu na konzolách – s transparentným "
            "milestone plánovaním a pravidelnými hrateľnými buildmi."
        ),
        "deliverables": [
            "Game design dokument a produkčný plán",
            "Hrateľné buildy každé 2 týždne",
            "Certifikácia (TRC / XR / Lotcheck) a submission",
            "Post-launch patche a DLC",
        ],
        "engines_supported": ["Unreal Engine 5", "Unity", "Vlastný C++ Engine"],
        "display_order": 1,
    },
    {
        "slug": "co-development-unreal-engine-5-unity",
        "title": "Co-Development v Unreal Engine 5 a Unity",
        "short_description": (
            "Rozšírime váš tím o seniorných programátorov, technických artistov a dizajnérov, ktorí sa "
            "zapoja do vašej pipeline do dvoch týždňov. Pracujeme vo vašom repozitári, vašich nástrojoch "
            "a vašom rytme – ako plnohodnotná súčasť vášho štúdia."
        ),
        "deliverables": [
            "Gameplay a systémové programovanie (C++ / Blueprints / C#)",
            "Multiplayer a online služby",
            "Nástroje a editor tooling na mieru",
            "Výkonnostné profilovanie a optimalizácia",
        ],
        "engines_supported": ["Unreal Engine 5", "Unity"],
        "display_order": 2,
    },
    {
        "slug": "konzolove-portovanie-optimalizacia",
        "title": "Konzolové portovanie & Optimalizácia (PS5, Xbox, Switch)",
        "short_description": (
            "Prenesieme vašu PC hru na PlayStation 5, Xbox Series X|S a Nintendo Switch bez kompromisov "
            "v zážitku. Postaráme sa o výkon, pamäť, ovládanie, platformové funkcie aj certifikáciu."
        ),
        "deliverables": [
            "Technický audit a odhad portu",
            "Optimalizácia CPU / GPU / pamäte pre cieľový hardvér",
            "Integrácia trofejí, achievementov a cloud save",
            "Príprava na certifikáciu a QA na dev kitoch",
        ],
        "engines_supported": ["Unreal Engine 5", "Unity", "Vlastný C++ Engine"],
        "display_order": 3,
    },
    {
        "slug": "3d-environment-art-postavy-technicky-art",
        "title": "3D Environment Art, Postavy & Technický Art",
        "short_description": (
            "Produkcia herných assetov v AAA kvalite – od modulárnych prostredí cez hrdinov a NPC až po "
            "shadery, VFX a optimalizované LOD reťazce pripravené na nasadenie do enginu."
        ),
        "deliverables": [
            "Modulárne prostredia a level art",
            "Postavy, rigging a animácie",
            "Shadery, materiály a VFX",
            "Optimalizácia assetov, LOD a Nanite pipeline",
        ],
        "engines_supported": ["Unreal Engine 5", "Unity"],
        "display_order": 4,
    },
]

COMMON_BENEFITS = [
    "Podiel na tržbách z vydaných hier",
    "Hardvér bez kompromisov (RTX pracovná stanica, dev kity)",
    "Hybridná práca a flexibilný pracovný čas",
    "25 dní dovolenky + 5 dní na tvorivý voľný čas",
    "Ročný rozpočet 1 200 € na vzdelávanie a konferencie",
]

JOBS = [
    {
        "title": "Senior Unreal Engine C++ Programátor",
        "department": JobOpening.Department.PROGRAMMING,
        "location": "Bratislava / Hybrid",
        "seniority": JobOpening.Seniority.SENIOR,
        "description": (
            "Budeš tvoriť jadro gameplay systémov pre náš nový UE5 projekt Zóna Zero – od replikácie "
            "v kooperatívnom multiplayeri po výkonnostné optimalizácie na konzolách. Spolupracuješ priamo "
            "s lead dizajnérom a technickým riaditeľom."
        ),
        "requirements": [
            "5+ rokov praxe s C++ v hernom vývoji",
            "Hlboká znalosť Unreal Engine (Gameplay Framework, GAS, replikácia)",
            "Skúsenosť s profilovaním (Unreal Insights, PIX, Razor)",
            "Aspoň jeden vydaný titul na PC alebo konzolách",
        ],
        "benefits": COMMON_BENEFITS + ["Relokačný bonus až 3 000 €"],
        "salary_from_eur": 3800,
    },
    {
        "title": "3D Environment Artist",
        "department": JobOpening.Department.ART,
        "location": "Bratislava / Hybrid",
        "seniority": JobOpening.Seniority.MEDIOR,
        "description": (
            "Hľadáme artistu, ktorý vie rozprávať príbeh prostredím. Budeš stavať modulárne kity, "
            "skladať levely a ladiť osvetlenie v Lumen pre naše UE5 projekty aj pre co-development "
            "zákazky našich partnerov."
        ),
        "requirements": [
            "3+ roky praxe v tvorbe herných prostredí",
            "Ovládanie Blender / Maya, Substance 3D Painter / Designer",
            "Znalosť Unreal Engine 5 (Nanite, Lumen, World Partition)",
            "Silné portfólio na ArtStation",
        ],
        "benefits": COMMON_BENEFITS,
        "salary_from_eur": 2600,
    },
    {
        "title": "Technical Animator",
        "department": JobOpening.Department.ART,
        "location": "Remote (SK / CZ)",
        "seniority": JobOpening.Seniority.MEDIOR,
        "description": (
            "Prepojíš svet animácie a enginu – staviaš rigy, animačné blueprinty a nástroje, ktoré "
            "zrýchlia prácu celého art tímu. Spolupracuješ s animátormi aj gameplay programátormi."
        ),
        "requirements": [
            "Skúsenosti s riggingom v Maya alebo Blender",
            "Animation Blueprints, Control Rig a Motion Matching v UE5",
            "Skriptovanie v Pythone (Maya / Blender API)",
            "Pochopenie herného motion capture pipeline",
        ],
        "benefits": COMMON_BENEFITS,
        "salary_from_eur": 2900,
    },
    {
        "title": "Senior Game Designer",
        "department": JobOpening.Department.DESIGN,
        "location": "Bratislava / Hybrid",
        "seniority": JobOpening.Seniority.SENIOR,
        "description": (
            "Prevezmeš zodpovednosť za core loop a progresiu nášho survival titulu. Navrhuješ systémy, "
            "píšeš špecifikácie, prototypuješ v Blueprintoch a vyhodnocuješ dáta z playtestov."
        ),
        "requirements": [
            "5+ rokov praxe v game dizajne, aspoň 2 vydané tituly",
            "Skúsenosť so systémovým dizajnom a ekonomikou hry",
            "Prototypovanie v Unreal Blueprints alebo Unity",
            "Výborná písomná komunikácia v slovenčine a angličtine",
        ],
        "benefits": COMMON_BENEFITS + ["Relokačný bonus až 3 000 €"],
        "salary_from_eur": 3400,
    },
    {
        "title": "Junior QA Tester (konzoly)",
        "department": JobOpening.Department.PRODUCTION,
        "location": "Bratislava / On-site",
        "seniority": JobOpening.Seniority.JUNIOR,
        "description": (
            "Staneš sa strážcom kvality našich hier na PS5, Xbox a Switch. Testuješ nové buildy, "
            "reportuješ chyby v Jire a pomáhaš pripraviť tituly na certifikáciu u platformových partnerov."
        ),
        "requirements": [
            "Vášeň pre hry a zmysel pre detail",
            "Schopnosť jasne a štruktúrovane popísať chybu",
            "Angličtina na úrovni B2",
            "Výhodou: skúsenosť s TRC / XR požiadavkami",
        ],
        "benefits": COMMON_BENEFITS,
        "salary_from_eur": 1500,
    },
]


class Command(BaseCommand):
    help = "Naplní databázu ukážkovými hrami, B2B službami a pracovnými pozíciami (idempotentne)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Odstráni aj všetky reakcie na pozície a obchodné dopyty.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        self.verbosity = options["verbosity"]
        if options["flush"]:
            JobApplication.objects.all().delete()
            BusinessInquiry.objects.all().delete()
            self.stdout.write(self.style.WARNING("Reakcie a dopyty boli odstránené."))

        for game_data in GAMES:
            data = dict(game_data)
            screenshots = data.pop("screenshots")
            slug = data.pop("slug")
            game, created = GameProject.objects.update_or_create(slug=slug, defaults=data)
            game.screenshots.all().delete()
            GameScreenshot.objects.bulk_create(
                GameScreenshot(game=game, image_url=unsplash(photo_id, 1920), caption=caption, display_order=index)
                for index, (photo_id, caption) in enumerate(screenshots, start=1)
            )
            self._log("Hra", game.title, created)

        for service_data in SERVICES:
            data = dict(service_data)
            slug = data.pop("slug")
            service, created = StudioService.objects.update_or_create(slug=slug, defaults=data)
            self._log("Služba", service.title, created)

        for job_data in JOBS:
            data = dict(job_data)
            title = data.pop("title")
            job, created = JobOpening.objects.update_or_create(title=title, defaults={**data, "is_active": True})
            self._log("Pozícia", job.title, created)

        self.stdout.write(self.style.SUCCESS(
            f"Hotovo – hry: {GameProject.objects.count()}, služby: {StudioService.objects.count()}, "
            f"aktívne pozície: {JobOpening.objects.filter(is_active=True).count()}."
        ))

    def _log(self, kind: str, name: str, created: bool) -> None:
        if self.verbosity < 2 and not created:
            return
        if self.verbosity < 1:
            return
        action = "vytvorená" if created else "aktualizovaná"
        self.stdout.write(f"  {kind} {action}: {name}")
