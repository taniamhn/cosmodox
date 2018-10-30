from .base import *

DEBUG = False

# Templates
TEMPLATES[0]['DIRS'] = [BASE_DIR('ui/build/prod')]

# Static files

STATICFILES_DIRS = (BASE_DIR('ui/build/prod'),)
MEDIA_ROOT = BASE_DIR('../media')

#  Ssl configuration

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
