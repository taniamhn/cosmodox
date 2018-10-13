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


class Query:
    pass
