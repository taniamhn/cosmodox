from django.contrib.auth.base_user import AbstractBaseUser
from django.conf import settings
from django.db import models


class User(AbstractBaseUser):

    email = models.EmailField(unique=True)
    last_name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'

    def get_full_name(self):
        return '{} {}'.format(self.first_name, self.last_name)

    def get_short_name(self):
        return '{} {}'.format(self.first_name, self.last_name)


class Institution(models.Model):

    name = models.CharField(max_length=100)
    owner = models.OneToOneField(settings.AUTH_USER_MODEL)

    def __str__(self):
        return self.name


class ResearchGroup(models.Model):

    name = models.CharField(max_length=100)
    owner = models.OneToOneField(settings.AUTH_USER_MODEL)
    areas = models.ManyToManyField('core.Area', related_name='research_groups')
    institution = models.ForeignKey(Institution, related_name='research_groups', blank=True, null=True)

    def __str__(self):
        return self.name


class Personal(models.Model):

    STUDENT = 'E'
    BACHELOR = 'B'
    GRADUATE = 'U'
    POSTGRADUATE = 'P'
    TECHNICIAN = 'T'
    OTHER = 'O'
    EDUCATION_LEVELS = (
        (STUDENT, 'Estudiante'),
        (BACHELOR, 'Bachiller'),
        (GRADUATE, 'Universitario'),
        (POSTGRADUATE, 'Posgrado'),
        (TECHNICIAN, 'Técnico'),
        (OTHER, 'Otros')
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL)
    areas = models.ManyToManyField('core.Area', related_name='personal_accounts')
    education_level = models.CharField(max_length=1, choices=EDUCATION_LEVELS, blank=True)
    # institucion = models.ForeignKey('Institucion', blank=True, null=True)
    # grupos_investigacion = models.ManyToManyField(
    #     'GrupoInvestigacion', blank=True, null=True)

    def __str__(self):
        return self.user.get_full_name()
