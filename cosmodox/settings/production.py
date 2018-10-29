from .base import *

DEBUG = False

# Static files
STATICFILES_DIRS = (BASE_DIR('ui/build/prod'),)

#  Ssl configuration

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
