from graphene_django_extras import (
    DjangoObjectType, DjangoListObjectType, DjangoObjectField, DjangoListObjectField
)
from .. import models


class User(DjangoObjectType):

    class Meta:
        model = models.User

class Institution(DjangoObjectType):

    class Meta:
        model = models.Institution


class InstitutionList(DjangoListObjectType):

    class Meta:
        model = models.Institution


class ResearchGroup(DjangoObjectType):

    class Meta:
        model = models.ResearchGroup


class ResearchGroupList(DjangoListObjectType):

    class Meta:
        model = models.ResearchGroup

class Personal(DjangoObjectType):

    class Meta:
        model = models.Personal


class PersonalList(DjangoListObjectType):

    class Meta:
        model = models.Personal


class Query:
    pass
