import graphene
from graphene_django_extras import DjangoSerializerMutation, DjangoInputObjectType
from graphene_file_upload.scalars import Upload
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

class UpdateProjectMutation(DjangoSerializerMutation):

    class Meta:
        serializer_class = serializers.UpdateProjectSerializer
        only_fields = serializers.UpdateProjectSerializer.Meta.fields
        input_field_name = 'input'

class ProjectUpdateInput(DjangoInputObjectType):

    files = graphene.List(graphene.NonNull(Upload))

    class Meta:
        model = serializers.ProjectUpdateSerializer.Meta.model
        only_fields = serializers.ProjectUpdateSerializer.Meta.fields


class CreateProjectUpdateMutation(DjangoSerializerMutation):

    class Meta:
        serializer_class = serializers.ProjectUpdateSerializer
        only_fields = serializers.ProjectUpdateSerializer.Meta.fields
        output_field_name = 'project_update'
        input_field_name = 'input'

    @classmethod
    def get_serializer_kwargs(cls, root, info, **kwargs):
        return {'context': {'request': info.context}}


class Mutation:
    create_project = CreateProjectMutation.CreateField(description='Creates a project')
    update_project = UpdateProjectMutation.UpdateField(description='Updates a project')
    create_project_update = CreateProjectUpdateMutation.CreateField(description='Creates a project update')
