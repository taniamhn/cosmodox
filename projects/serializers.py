from rest_framework import serializers
from django.db import transaction
from .models import Project


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


