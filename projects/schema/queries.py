import graphene
from graphene_django_extras import (
    DjangoObjectType, DjangoListObjectType, DjangoObjectField, DjangoListObjectField
)
from core.schema import Area
from .. import models


class Project(DjangoObjectType):
    
    areas = graphene.List(Area)
    can_edit = graphene.Boolean()
    detail_url = graphene.String(source='detail_url')
    state_label = graphene.String(source='get_state_display')

    class Meta:
        model = models.Project
    
    def resolve_can_edit(self, info, **kwargs):
        return self.can_edit(info.context.user)

    def resolve_areas(self, info, **kwargs):
        return self.areas.all()


class ProjectList(DjangoListObjectType):

    class Meta:
        model = models.Project


class ProjectUpdate(DjangoObjectType):

    class Meta:
        model = models.ProjectUpdate


class Query:
    projects = DjangoListObjectField(ProjectList, description='All projects list')
    project = DjangoObjectField(Project)
