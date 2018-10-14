from django.conf import settings
from django.db import models


class Project(models.Model):

    COMPLETED = 'C'
    IN_PROCESS = 'EP'
    SUSPENDED = 'S'
    STATES = (
        (COMPLETED, 'Completo'),
        (IN_PROCESS, 'En proceso'),
        (SUSPENDED, 'Suspendido')
    )

    name = models.CharField(max_length=200)
    theme = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    areas = models.ManyToManyField('core.Area')
    vinculated_institutions = models.TextField(blank=True)
    state = models.CharField(max_length=2, choices=STATES, default=IN_PROCESS)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='projects')

    def __str__(self):
        return self.name


class ProjectUpdate(models.Model):

    content = models.TextField()
    created_at = models.DateField(auto_now_add=True)
    project = models.ForeignKey(Project, related_name='updates')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='project_updates')

    def __str__(self):
        return '{} Update #{}'.format(self.project, self.id)
