from django.utils.module_loading import import_string
from django.conf import settings
from django.db import models

USER_PATH = 'accounts.models.User'

def project_img_path(instance, filename):
    return 'projects/{}'.format(filename)

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
    image = models.ImageField(upload_to=project_img_path, blank=True)
    state = models.CharField(max_length=2, choices=STATES, default=IN_PROCESS)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='projects')

    def __str__(self):
        return self.name

    def detail_url(self):
        return '/project/{}'.format(self.id)
    
    def members(self):
        """Un queryset de usuarios con los miembros del proyecto."""

        User = import_string(USER_PATH)
        group = getattr(self.owner, 'research_group', None)
        members = group.members.values('user') if group else []
        return User.objects.filter(models.Q(id=self.owner_id) | models.Q(id__in=members))
    
    def can_edit(self, user):
        return user.id == self.owner_id
    
    def can_add_update(self, user):
        return self.members().filter(id=user.id).exists()

class ProjectUpdate(models.Model):

    content = models.TextField()
    created_at = models.DateField(auto_now_add=True)
    project = models.ForeignKey(Project, related_name='updates')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='project_updates')

    class Meta:
        ordering = ['-created_at', '-id']

    def __str__(self):
        return '{} Update #{}'.format(self.project, self.id)


def file_path(instance, filename):
    update = instance.update
    return 'project_{}/update_{}/{}'.format(update.project_id, update.id, filename)

class UpdateFile(models.Model):
    update = models.ForeignKey(ProjectUpdate, related_name='files')
    document = models.FileField(upload_to=file_path)
