from django.db import transaction
from django.contrib.auth import login, authenticate
from rest_framework import serializers
from .models import Institution, User, ResearchGroup, Personal


class UserSerializer(serializers.ModelSerializer):

    password1 = serializers.CharField()
    password2 = serializers.CharField()

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password1', 'password2']
    
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password1')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class InstitutionSerializer(serializers.ModelSerializer):

    owner = UserSerializer()

    class Meta:
        model = Institution
        fields = ['name', 'owner']

    @transaction.atomic
    def create(self, validated_data):
        owner = validated_data.pop('owner')
        user_serializer = UserSerializer(data=owner)
        user_serializer.is_valid()
        user = user_serializer.save()
        institution = Institution.objects.create(owner=user, **validated_data)
        user = authenticate(email=owner['email'], password=owner['password1'])
        login(self.context['request'], user)
        return institution


class ReasearchGroupSerializer(serializers.ModelSerializer):

    owner = UserSerializer()

    class Meta:
        model = ResearchGroup
        fields = ['name', 'owner', 'areas', 'institution']
    
    @transaction.atomic
    def create(self, validated_data):
        owner = validated_data.pop('owner')
        user_serializer = UserSerializer(data=owner)
        user_serializer.is_valid()
        user = user_serializer.save()
        areas = validated_data.pop('areas')
        group = ResearchGroup.objects.create(owner=user, **validated_data)
        group.areas = areas
        user = authenticate(email=owner['email'], password=owner['password1'])
        login(self.context['request'], user)
        return group


class PersonalAccountSerializer(serializers.ModelSerializer):

    user = UserSerializer()

    class Meta:
        model = Personal
        fields = ['user', 'areas', 'education_level']
    
    @transaction.atomic
    def create(self, validated_data):
        owner = validated_data.pop('owner')
        user_serializer = UserSerializer(data=owner)
        user_serializer.is_valid()
        user = user_serializer.save()
        areas = validated_data.pop('areas')
        account = Personal.objects.create(user=user, **validated_data)
        account.areas = areas
        user = authenticate(email=owner['email'], password=owner['password1'])
        login(self.context['request'], user)
        return account

# EDIT SERIALIZERS

class EditUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']

    @transaction.atomic
    def update(self, instance, validated_data):
        for name, value in validated_data.items():
            setattr(instance, name, value)
        instance.save()
        return instance


class EditInstitutionSerializer(serializers.ModelSerializer):

    owner = EditUserSerializer()

    class Meta:
        model = Institution
        fields = ['name', 'owner']

    @transaction.atomic
    def update(self, instance, validated_data):
        user_serializer = EditUserSerializer(instance.owner, data=validated_data.pop('owner'))
        user_serializer.is_valid()
        user = user_serializer.save()
        for name, value in validated_data.items():
            setattr(instance, name, value)
        instance.save()
        return instance


class EditResearchGroupSerializer(serializers.ModelSerializer):

    owner = EditUserSerializer()

    class Meta:
        model = ResearchGroup
        fields = ['name', 'owner', 'areas', 'institution']

    @transaction.atomic
    def update(self, instance, validated_data):
        user_serializer = EditUserSerializer(instance.owner, data=validated_data.pop('owner'))
        user_serializer.is_valid()
        user = user_serializer.save()
        areas = validated_data.pop('areas')
        for name, value in validated_data.items():
            setattr(instance, name, value)
        instance.save()
        instance.areas = areas
        return instance


class EditPersonalAccountSerializer(serializers.ModelSerializer):

    owner = EditUserSerializer()

    class Meta:
        model = Personal
        fields = ['user', 'areas', 'education_level']

    @transaction.atomic
    def update(self, instance, validated_data):
        user_serializer = EditUserSerializer(instance.user, data=validated_data.pop('user'))
        user_serializer.is_valid()
        user = user_serializer.save()
        areas = validated_data.pop('areas')
        for name, value in validated_data.items():
            setattr(instance, name, value)
        instance.save()
        instance.areas = areas
        return instance

class JoinResearchGroupSerializer(serializers.ModelSerializer):

    group = serializers.PrimaryKeyRelatedField(queryset=ResearchGroup.objects.all())

    class Meta:
        model = ResearchGroup
        fields = ['group']
    
    @transaction.atomic
    def update(self, instance, validated_data):
        instance.research_groups.add(validated_data['group'])
        return instance
