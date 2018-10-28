from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db import models
from .managers import UserManager

def profile_img_path(instance, filename):
    return 'profile/{}'.format(filename)

class User(AbstractUser):

    username = None
    email = models.EmailField(unique=True)
    image = models.ImageField(upload_to=profile_img_path, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def profile(self):
        return getattr(self, 'institution', None) or getattr(self, 'research_group', None) or getattr(self, 'personal', None)

class Institution(models.Model):

    name = models.CharField(max_length=100)
    owner = models.OneToOneField(settings.AUTH_USER_MODEL)

    def __str__(self):
        return self.name
    
    def detail_url(self):
        return '/institution/{}'.format(self.id)
    
    def can_edit(self, user):
        return user.id == self.owner_id


class ResearchGroup(models.Model):

    name = models.CharField(max_length=100)
    areas = models.ManyToManyField('core.Area', related_name='research_groups')
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, related_name='research_group')
    institution = models.ForeignKey(Institution, related_name='research_groups', blank=True, null=True)

    def __str__(self):
        return self.name
    
    def projects(self):
        return self.owner.projects.all()
    
    def detail_url(self):
        return '/research-group/{}'.format(self.id)
    
    def can_edit(self, user):
        return user.id == self.owner_id


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
    research_groups = models.ManyToManyField(ResearchGroup, related_name='members', blank=True)

    def __str__(self):
        return self.user.get_full_name()
    
    def projects(self):
        return self.user.projects.all()
    
    def detail_url(self):
        return '/profile/{}'.format(self.id)
    
    def can_edit(self, user):
        return user.id == self.user_id
