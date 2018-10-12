from .base import *

#  Apps

SHARED_APPS += [
    'django_extensions',
    'debug_toolbar'
]

INSTALLED_APPS = SHARED_APPS + list(set(TENANT_APPS) - set(SHARED_APPS))

# Middleware

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'tenant_schemas.middleware.TenantMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'waffle.middleware.WaffleMiddleware',
    'reversion.middleware.RevisionMiddleware'
]

# Debug toolbar

INTERNAL_IPS = ['127.0.0.1']
import socket
ip = socket.gethostbyname(socket.gethostname())
# INTERNAL_IPS += [ip[:-1] + "1"]

# Graphene configuration

GRAPHENE['MIDDLEWARE'] += ['graphene_django.debug.DjangoDebugMiddleware']

# Shell plus

SHELL_PLUS_POST_IMPORTS = [
    ('pacientes.serializers', '*'),
    ('agenda.serializers', '*')
]
