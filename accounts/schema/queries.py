import graphene
from graphene_django_extras import (
    DjangoObjectType, DjangoListObjectType, DjangoObjectField, DjangoListObjectField
)
from core.schema import Area
from .. import models

class Profile(graphene.Interface):

    can_edit = graphene.Boolean()
    id = graphene.ID(required=True)
    detail_url = graphene.String(source='detail_url')

    def resolve_can_edit(self, info, **kwargs):
        return self.can_edit(info.context.user)


class Institution(DjangoObjectType):

    class Meta:
        model = models.Institution
        interfaces = [Profile]

class InstitutionList(DjangoListObjectType):

    class Meta:
        model = models.Institution


class ResearchGroup(DjangoObjectType):

    areas = graphene.List(Area)

    class Meta:
        model = models.ResearchGroup
        interfaces = [Profile]
    
    def resolve_areas(self, info, **kwargs):
        return self.areas.all()


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

    fullName = graphene.String(source='get_full_name')
    profile = graphene.Field(Profile, source='profile')

    class Meta:
        model = models.User

class Query:
    user = DjangoObjectField(User)
    institution = DjangoObjectField(Institution)
    research_group = DjangoObjectField(ResearchGroup)
    personal_account = DjangoObjectField(PersonalAccount)

    institutions = DjangoListObjectField(InstitutionList)
