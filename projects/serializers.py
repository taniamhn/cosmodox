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

class UpdateProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = [
            'id', 'state', 'name', 'theme', 'description', 'areas', 'vinculated_institutions'
        ]

        @transaction.atomic
        def update(self, instance, validated_data):
            areas = validated_data.pop('areas')
            for name, value in validated_data.items():
                setattr(instance, name, value)
            instance.save()
            instance.areas = areas
            return instance


class ProjectUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectUpdate
        fields = ['content', 'project']
    
    @transaction.atomic
    def create(self, validated_data):
        user = self.context['request'].user
        update = ProjectUpdate.objects.create(created_by=user, **validated_data)
        return update

