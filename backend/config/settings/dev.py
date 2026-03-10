from .base import *

DEBUG = True
ALLOWED_HOSTS = ['*']

# SQLite for development — zero setup, zero RAM overhead
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        # Put DB on HDD to save SSD space
        # 'NAME': Path('D:/simplewa-crm-data/dev.sqlite3'),
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# CORS — allow React dev server
CORS_ALLOW_ALL_ORIGINS = True

# Show emails in terminal during dev
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
