from rest_framework import serializers
from django.db import transaction
from .models import Project, ProjectUpdate


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = [
            'name', 'theme', 'description', 'areas', 'vinculated_institutions'
        ]
    
    @transaction.atomic
    def create(self, validated_data):
        user = self.context['request'].user
        areas = validated_data.pop('areas')
        project = Project.objects.create(**validated_data, owner=user)
        project.areas = areas
        return project


class ProjectUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectUpdate
        fields = ['content', 'project']
    
    @transaction.atomic
    def create(self, validated_data):
        user = self.context['request'].user
        update = ProjectUpdate.objects.create(created_by=user, **validated_data)
        return update

