from rest_framework import serializers
from django.db import transaction
from .models import Institution, User, ResearchGroup, Personal


class UserSerializer(serializers.ModelSerializer):

    password1 = serializers.CharField()
    password2 = serializers.CharField()

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'password1', 'password2'
        ]
    
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
        user_serializer = UserSerializer(data=validated_data.pop('owner'))
        user_serializer.is_valid()
        user = user_serializer.save()
        institution = Institution.objects.create(owner=user, **validated_data)
        return institution


class ReasearchGroupSerializer(serializers.ModelSerializer):

    owner = UserSerializer()

    class Meta:
        model = ResearchGroup
        fields = ['name', 'owner', 'areas']
    
    @transaction.atomic
    def create(self, validated_data):
        user_serializer = UserSerializer(data=validated_data.pop('owner'))
        user_serializer.is_valid()
        user = user_serializer.save()
        areas = validated_data.pop('areas')
        group = ResearchGroup.objects.create(owner=user, **validated_data)
        group.areas = areas
        return group


class PersonalAccountSerializer(serializers.ModelSerializer):

    user = UserSerializer()

    class Meta:
        model = Personal
        fields = ['user', 'areas', 'education_level']
    
    @transaction.atomic
    def create(self, validated_data):
        user_serializer = UserSerializer(data=validated_data.pop('user'))
        user_serializer.is_valid()
        user = user_serializer.save()
        areas = validated_data.pop('areas')
        account = Personal.objects.create(user=user, **validated_data)
        account.areas = areas
        return account
