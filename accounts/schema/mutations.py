import graphene
from django.contrib.auth import logout, authenticate, login
from graphene_django_extras import DjangoSerializerMutation, DjangoInputObjectType
from .. import serializers
from .queries import User


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
        output_field_name = 'research_group'
        input_field_name = 'input'
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
        output_field_name = 'research_group'
        input_field_name = 'input'
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


class LoginMutation(graphene.Mutation):

    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
    
    ok = graphene.Boolean()
    user = graphene.Field(User)

    def mutate(self, info, email, password):
        ok = False
        user = authenticate(info.context, email=email, password=password)
        if user is not None:
            login(info.context, user)
            ok = True
        
        return LoginMutation(ok=ok, user=user)


class LogoutMutation(graphene.Mutation):

    ok = graphene.Boolean()

    def mutate(self, info):
        logout(info.context)
        return LogoutMutation(ok=True)


class Mutation:
    create_institution = CreateInstitutionMutation.CreateField(description='Creates an institution')
    create_research_group = CreateResearchGroupMutation.CreateField(description='Creates a research group')
    create_personal_account = CreatePersonalAccountMutation.CreateField(description='Creates a personal account')

    update_institution = UpdateInstitutionMutation.UpdateField(description='Updates an institution')
    update_research_group = UpdateResearchGroupMutation.UpdateField(description='Updates a research group')
    update_personal_account = UpdatePersonalAccountMutation.UpdateField(description='Updates a personal account')
    join_research_group = JoinResearchGroupMutation.UpdateField(description='Join the user to a research group')

    login = LoginMutation.Field()
    logout = LogoutMutation.Field()
