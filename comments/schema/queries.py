from graphene_django_extras import (
    DjangoObjectType, DjangoListObjectType, DjangoObjectField, DjangoListObjectField
)
from .. import models

class ProjectComment(DjangoObjectType):

  class Meta:
    model = models.ProjectComment

class ProjectCommentList(DjangoListObjectType):

  class Meta:
    model = models.ProjectComment

class ProjectUpdateComment(DjangoObjectType):

  class Meta:
    model = models.ProjectUpdateComment

class ProjectUpdateCommentList(DjangoListObjectType):

  class Meta:
    model = models.ProjectUpdateComment

class Query:
  project_comment = DjangoObjectField(ProjectComment)
  project_comments = DjangoListObjectField(ProjectCommentList)
  project_update_comment = DjangoObjectField(ProjectUpdateComment)
  project_update_comments = DjangoListObjectField(ProjectUpdateCommentList)
