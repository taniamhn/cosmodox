from graphene_django_extras import (
    DjangoObjectType, DjangoListObjectType, DjangoObjectField, DjangoListObjectField
)
from .. import models


class Area(DjangoObjectType):

    class Meta:
        model = models.Area


class AreaList(DjangoListObjectType):

    class Meta:
        model = models.Area


class Query:
    areas = DjangoListObjectField(AreaList, description='All areas list')
