from graphene_django_extras import DjangoSerializerMutation, DjangoInputObjectType
from .. import serializers
from .. import models


class CreateProjectMutation(DjangoSerializerMutation):

    class Meta:
        serializer_class = serializers.ProjectSerializer
        only_fields = serializers.ProjectSerializer.Meta.fields
        input_field_name = 'input'

    @classmethod
    def get_serializer_kwargs(cls, root, info, **kwargs):
        return {'context': {'request': info.context}}

class CreateProjectUpdateMutation(DjangoSerializerMutation):

    class Meta:
        serializer_class = serializers.ProjectUpdateSerializer
        only_fields = serializers.ProjectUpdateSerializer.Meta.fields
        input_field_name = 'input'

    @classmethod
    def get_serializer_kwargs(cls, root, info, **kwargs):
        return {'context': {'request': info.context}}


class Mutation:
    create_project = CreateProjectMutation.CreateField(description='Creates a project')
    create_project_update = CreateProjectUpdateMutation.CreateField(description='Creates a project update')
