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

class PersonalAccount(DjangoObjectType):

    class Meta:
        model = models.Personal


class PersonalAccountList(DjangoListObjectType):

    class Meta:
        model = models.Personal


class Query:
    user = DjangoObjectField(User)
    institution = DjangoObjectField(Institution)
    research_group = DjangoObjectField(ResearchGroup)
    personal_account = DjangoObjectField(PersonalAccount)
