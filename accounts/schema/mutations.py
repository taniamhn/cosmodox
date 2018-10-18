import graphene
from graphene_django_extras import DjangoSerializerMutation, DjangoInputObjectType
from .. import serializers


class CreateUserInput(DjangoInputObjectType):

    password1 = graphene.String(required=True)
    password2 = graphene.String(required=True)

    class Meta:
        model = serializers.UserSerializer.Meta.model
        only_fields = serializers.UserSerializer.Meta.fields


class CreateInstitutionMutation(DjangoSerializerMutation):

    class Meta:
        serializer_class = serializers.InstitutionSerializer
        only_fields = serializers.InstitutionSerializer.Meta.fields
        input_field_name = 'input'
        nested_fields = ['owner']
    
    @classmethod
    def get_serializer_kwargs(cls, root, info, **kwargs):
        return {'context': {'request': info.context}}


class CreateResearchGroupMutation(DjangoSerializerMutation):

    class Meta:
        serializer_class = serializers.ReasearchGroupSerializer
        only_fields = serializers.ReasearchGroupSerializer.Meta.fields
        input_field_name = 'input'
        output_field_name = 'research_group'
        nested_fields = ['owner']
    
    @classmethod
    def get_serializer_kwargs(cls, root, info, **kwargs):
        return {'context': {'request': info.context}}

class CreatePersonalAccountMutation(DjangoSerializerMutation):

    class Meta:
        serializer_class = serializers.PersonalAccountSerializer
        only_fields = serializers.PersonalAccountSerializer.Meta.fields
        input_field_name = 'input'
        nested_fields = ['user']
    
    @classmethod
    def get_serializer_kwargs(cls, root, info, **kwargs):
        return {'context': {'request': info.context}}

# EDIT MUTATION

class UpdateUserInput(DjangoInputObjectType):

    class Meta:
        model = serializers.EditUserSerializer.Meta.model
        only_fields = serializers.EditUserSerializer.Meta.fields
        input_for = 'update'

class UpdateInstitutionMutation(DjangoSerializerMutation):

    class Meta:
        serializer_class = serializers.EditInstitutionSerializer
        only_fields = serializers.EditInstitutionSerializer.Meta.fields
        input_field_name = 'input'
        nested_fields = ['owner']

class UpdateResearchGroupMutation(DjangoSerializerMutation):

    class Meta:
        serializer_class = serializers.EditResearchGroupSerializer
        only_fields = serializers.EditResearchGroupSerializer.Meta.fields
        input_field_name = 'input'
        output_field_name = 'research_group'
        nested_fields = ['owner']

class UpdatePersonalAccountMutation(DjangoSerializerMutation):

    class Meta:
        serializer_class = serializers.EditPersonalAccountSerializer
        only_fields = serializers.EditPersonalAccountSerializer.Meta.fields
        input_field_name = 'input'
        nested_fields = ['user']

class JoinResearchGroupInput(DjangoInputObjectType):

    group = graphene.ID(required=True)

    class Meta:
        model = serializers.JoinResearchGroupSerializer.Meta.model
        only_fields = serializers.JoinResearchGroupSerializer.Meta.fields
        input_for = 'update'

class JoinResearchGroupMutation(DjangoSerializerMutation):

    class Meta:
        serializer_class = serializers.JoinResearchGroupSerializer
        only_fields = serializers.JoinResearchGroupSerializer.Meta.fields
        input_field_name = 'input'
    
    @classmethod
    def save_mutation(cls, root, info, **kwargs):
        kwargs[cls._meta.input_field_name].update({'id': info.context.user.id})
        return super().save_mutation(root, info, **kwargs)


class Mutation:
    create_institution = CreateInstitutionMutation.CreateField(description='Creates an institution')
    create_research_group = CreateResearchGroupMutation.CreateField(description='Creates a research group')
    create_personal_account = CreatePersonalAccountMutation.CreateField(description='Creates a personal account')

    update_institution = UpdateInstitutionMutation.UpdateField(description='Updates an institution')
    update_research_group = UpdateResearchGroupMutation.UpdateField(description='Updates a research group')
    update_personal_account = UpdatePersonalAccountMutation.UpdateField(description='Updates a personal account')
    join_research_group = JoinResearchGroupMutation.UpdateField(description='Join the user to a research group')
