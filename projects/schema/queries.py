import graphene
from graphene_django_extras import (
    DjangoObjectType, DjangoListObjectType, DjangoObjectField, DjangoListObjectField
)
from core.schema import Area, File
from .. import models


class Project(DjangoObjectType):
    
    areas = graphene.List(Area)
    image = graphene.Field(File)
    can_edit = graphene.Boolean()
    can_add_update = graphene.Boolean()
    detail_url = graphene.String(source='detail_url')
    state_label = graphene.String(source='get_state_display')

    class Meta:
        model = models.Project
    
    def resolve_can_edit(self, info, **kwargs):
        return self.can_edit(info.context.user)
    
    def resolve_can_add_update(self, info, **kwargs):
        return self.can_add_update(info.context.user)

    def resolve_areas(self, info, **kwargs):
        return self.areas.all()
    
    def resolve_image(self, info, **kwargs):
        if not self.image:
            return None
        
        return self.image


class ProjectList(DjangoListObjectType):

    class Meta:
        model = models.Project
        filter_fields = ['id']


class ProjectUpdate(DjangoObjectType):

    class Meta:
        model = models.ProjectUpdate


class UpdateFile(DjangoObjectType):

    document = graphene.Field(File, required=True)

    class Meta:
        model = models.UpdateFile


class UpdateFileList(DjangoListObjectType):

    class Meta:
        model = models.UpdateFile


class Query:
    projects = DjangoListObjectField(ProjectList, description='All projects list')
    project = DjangoObjectField(Project)
