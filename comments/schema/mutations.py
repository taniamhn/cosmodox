from graphene_django_extras import DjangoSerializerMutation, DjangoInputObjectType
from .. import serializers

class createProjectCommentMutation(DjangoSerializerMutation):

  class Meta:
    serializer_class = serializers.ProjectCommentSerializer
    only_fields = serializers.ProjectCommentSerializer.Meta.fields
    input_field_name = 'input'
    output_field_name = 'project_comment'

  @classmethod
  def get_serializer_kwargs(cls, root, info, **kwargs):
    return {'context': {'request': info.context}}

class createProjectUpdateCommentMutation(DjangoSerializerMutation):

  class Meta:
    serializer_class = serializers.ProjectUpdateCommentSerializer
    only_fields = serializers.ProjectUpdateCommentSerializer.Meta.fields
    input_field_name = 'input'
    output_field_name = 'project_update_comment'

  @classmethod
  def get_serializer_kwargs(cls, root, info, **kwargs):
    return {'context': {'request': info.context}}

class Mutation:
    create_project_comment = createProjectCommentMutation.CreateField(
      description='Creates a project comment'
    )
    create_project_update_comment = createProjectUpdateCommentMutation.CreateField(
      description='Creates a project update comment'
    )
