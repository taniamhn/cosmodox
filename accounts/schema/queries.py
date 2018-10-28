import graphene
from graphene_django_extras import (
    DjangoObjectType, DjangoListObjectType, DjangoObjectField, DjangoListObjectField
)
from projects.schema import Project
from core.schema import Area, File
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

    projects = graphene.List(Project, source='projects')
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

    areas = graphene.List(Area)
    research_groups = graphene.List(ResearchGroup)
    projects = graphene.List(Project, source='projects')
    education_level_label = graphene.String(source='get_education_level_display')

    class Meta:
        model = models.Personal
        interfaces = [Profile]
    
    def resolve_areas(self, info, **kwargs):
        return self.areas.all()

    def resolve_research_groups(self, info, **kwargs):
        return self.research_groups.all()


class PersonalAccountList(DjangoListObjectType):

    class Meta:
        model = models.Personal


class User(DjangoObjectType):

    image = graphene.Field(File)
    fullName = graphene.String(source='get_full_name')
    profile = graphene.Field(Profile, source='profile')

    class Meta:
        model = models.User

class Query:
    user = DjangoObjectField(User)
    current_user = graphene.Field(User)
    institution = DjangoObjectField(Institution)
    research_group = DjangoObjectField(ResearchGroup)
    personal_account = DjangoObjectField(PersonalAccount)

    institutions = DjangoListObjectField(InstitutionList)

    def resolve_current_user(self, info, **kwargs):
        return info.context.user if info.context.user.is_authenticated() else None
