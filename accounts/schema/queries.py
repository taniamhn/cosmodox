import graphene
from graphene_django_extras import (
    DjangoObjectType, DjangoListObjectType, DjangoObjectField, DjangoListObjectField
)
from .. import models

class Profile(graphene.Interface):

    id = graphene.ID(required=True)
    detail_url = graphene.String(source='detail_url')


class Institution(DjangoObjectType):

    class Meta:
        model = models.Institution
        interfaces = [Profile]

class InstitutionList(DjangoListObjectType):

    class Meta:
        model = models.Institution


class ResearchGroup(DjangoObjectType):

    class Meta:
        model = models.ResearchGroup
        interfaces = [Profile]


class ResearchGroupList(DjangoListObjectType):

    class Meta:
        model = models.ResearchGroup

class PersonalAccount(DjangoObjectType):

    class Meta:
        model = models.Personal
        interfaces = [Profile]


class PersonalAccountList(DjangoListObjectType):

    class Meta:
        model = models.Personal


class User(DjangoObjectType):

    profile = graphene.Field(Profile, source='profile')

    class Meta:
        model = models.User

class Query:
    user = DjangoObjectField(User)
    institution = DjangoObjectField(Institution)
    research_group = DjangoObjectField(ResearchGroup)
    personal_account = DjangoObjectField(PersonalAccount)

    institutions = DjangoListObjectField(InstitutionList)
