from graphene_django_extras import (
    DjangoObjectType, DjangoListObjectType, DjangoObjectField, DjangoListObjectField
)
from .. import models


class Project(DjangoObjectType):

    class Meta:
        model = models.Project


class ProjectList(DjangoListObjectType):

    class Meta:
        model = models.Project


class ProjectUpdate(DjangoObjectType):

    class Meta:
        model = models.ProjectUpdate


class Query:
    projects = DjangoListObjectField(ProjectList, description='All projects list')
    project = DjangoObjectField(Project)
