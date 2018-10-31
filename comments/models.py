from django.db import models
from django.conf import settings

class ProjectComment(models.Model):

  content = models.TextField()
  created_at = models.DateField(auto_now_add=True)
  project = models.ForeignKey('projects.Project', related_name='comments')
  created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='project_comments')

  def __str__(self):
    return '{} - {}'.format(self.project_id, self.id)


class ProjectUpdateComment(models.Model):

  content = models.TextField()
  created_at = models.DateField(auto_now_add=True)
  project_update = models.ForeignKey('projects.ProjectUpdate', related_name='comments')
  created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='project_update_comments')

  def __str__(self):
    return '{} - {}'.format(self.project_update_id, self.id)
