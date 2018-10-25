import graphene
from graphene_django_extras import (
    DjangoObjectType, DjangoListObjectType, DjangoObjectField, DjangoListObjectField
)
from .. import models

class File(graphene.ObjectType):

    url = graphene.String(required=True)
    name = graphene.String(required=True)
    short_name = graphene.String(required=True)

    def resolve_short_name(self, info, **kwargs):
        return self.name.split('/')[-1]

class Area(DjangoObjectType):

    class Meta:
        model = models.Area


class AreaList(DjangoListObjectType):

    class Meta:
        model = models.Area


class Query:
    areas = DjangoListObjectField(AreaList, description='All areas list')
