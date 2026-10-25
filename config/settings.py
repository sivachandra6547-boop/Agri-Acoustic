import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-change-me")
DEBUG = os.environ.get("DEBUG", "False").lower() == "true"

ALLOWED_HOSTS = [
    "agri-acoustic.vercel.app",
    "agri-acoustic-orpin.vercel.app",
    ".vercel.app",
    "localhost",
    "127.0.0.1",
]

INSTALLED_APPS = [
    "django.contrib.staticfiles",
    "store",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "store.context_processors.site",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles_build" / "static"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Fill these with REAL details. Empty values show a placeholder in the footer.
SITE = {
    "email": "",
    "phone": "",
    "address": "",
    "instagram": "",
    "linkedin": "",
    "facebook": "",
}

# Placeholder shipping rules (also mirrored in static/js/main.js).
SHIPPING = {
    "flat": 100,
    "free_above": 2000,
}