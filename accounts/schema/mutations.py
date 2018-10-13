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


class CreateResearchGroupMutation(DjangoSerializerMutation):

    class Meta:
        serializer_class = serializers.ReasearchGroupSerializer
        only_fields = serializers.ReasearchGroupSerializer.Meta.fields
        input_field_name = 'input'
        nested_fields = ['owner']

class CreatePersonalAccountMutation(DjangoSerializerMutation):

    class Meta:
        serializer_class = serializers.PersonalAccountSerializer
        only_fields = serializers.PersonalAccountSerializer.Meta.fields
        input_field_name = 'input'
        nested_fields = ['user']


class Mutation:
    create_institution = CreateInstitutionMutation.CreateField(description='Creates an institution')
    create_research_group = CreateResearchGroupMutation.CreateField(description='Creates a research group')
    create_personal_account = CreatePersonalAccountMutation.CreateField(description='Creates a personal account')
