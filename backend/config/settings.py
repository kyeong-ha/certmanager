from pathlib import Path
import os

DEBUG = os.getenv('DB_DEBUG')
SECRET_KEY = os.getenv('DB_SECRET_KEY')

# ─────────────────────────────────────────────────────────────────────────

ENVIRONMENT = os.getenv("DJANGO_ENV", "development")

if ENVIRONMENT == "production":
    BACKEND_DOMAIN = "https://api.example.com"
    X_FRAME_OPTIONS = 'SAMEORIGIN'  
else:
    BACKEND_DOMAIN = "http://localhost:8000"
    X_FRAME_OPTIONS = 'ALLOWALL'
    
# ─────────────────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).resolve().parent.parent

# 정적, 미디어, 로그·캐시 경로를 .local/ 하위로 통합
LOCAL_DIR = Path(os.getenv("DJANGO_LOCAL_DIR", BASE_DIR / ".local"))
LOCAL_DIR.mkdir(exist_ok=True)

# 정적 파일(CSS, JavaScript, Images) 경로
STATIC_URL = "/static/"
STATIC_ROOT = LOCAL_DIR / "staticfiles"

# 미디어 파일 경로
MEDIA_URL = "/media/"
MEDIA_ROOT = LOCAL_DIR / "media"

# 로그 경로
LOG_DIR = LOCAL_DIR / "logs"
LOG_DIR.mkdir(exist_ok=True)
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "file": {
            "class": "logging.FileHandler",
            "filename": LOG_DIR / "django.log",
        },
    },
    "root": {
        "handlers": ["file"],
        "level": "INFO",
    },
}

# 캐시 경로
CACHES_DIR = LOCAL_DIR / "cache"
CACHES_DIR.mkdir(exist_ok=True)
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.filebased.FileBasedCache",
        "LOCATION": LOCAL_DIR / "cache",
    }
}
# ─────────────────────────────────────────────────────────────────────────

ALLOWED_HOSTS = os.getenv('DB_ALLOWED_HOSTS').split(' ')
WSGI_APPLICATION = 'config.wsgi.application'

# CORS 설정(Cross-Origin Resource Sharing)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://certmanager-frontend:3000",
    "https://your-domain.com",
]

# CSRF 설정(Cross-Site Request Forgery)
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://certmanager-frontend:3000"
]
CORS_ALLOW_CREDENTIALS = True

# ─────────────────────────────────────────────────────────────────────────

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

ROOT_URLCONF = 'config.urls'

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'config',
    'api.cert',
    'api.dashboard',
    'api.edu',
    'api.logs',
    'api.user',
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB'),
        'USER': os.getenv('POSTGRES_USER'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
        'HOST': os.getenv('DB_HOST'), 
        'PORT': os.getenv('DB_PORT'),
    }
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'ko-kr'
TIME_ZONE = 'Asia/Seoul'
USE_I18N = True
USE_L10N = True
USE_TZ = True