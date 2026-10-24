import os

DEBUG = os.environ.get("DEBUG", "False").lower() == "true"
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = "dev-only-change-me"
DEBUG = True
ALLOWED_HOSTS = [    "agri-acoustic.vercel.app",
    ".vercel.app",
    "localhost",
    "127.0.0.1",
]
CSRF_TRUSTED_ORIGINS = [
    "https://agri-acoustic.vercel.app",
]
INSTALLED_APPS = ["django.contrib.staticfiles", "store"]
MIDDLEWARE = ["django.middleware.security.SecurityMiddleware",
              "django.middleware.common.CommonMiddleware"]
ROOT_URLCONF = "config.urls"
TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [], "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.request",
        "store.context_processors.site",
    ]},
}]
WSGI_APPLICATION = "config.wsgi.application"
USE_TZ = True
STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Fill these in with REAL details. Empty values show a placeholder in the footer.
SITE = {"email": "", "phone": "", "address": "",
        "instagram": "", "linkedin": "", "facebook": ""}
# Placeholder shipping rules until real rates are confirmed (also mirrored in main.js).
SHIPPING = {"flat": 100, "free_above": 2000}
