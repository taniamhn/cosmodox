from rest_framework import serializers
from django.db import transaction
from .models import ProjectComment, ProjectUpdateComment


class ProjectCommentSerializer(serializers.ModelSerializer):

  class Meta:
    model = ProjectComment
    fields = ['content', 'project']

  @transaction.atomic
  def create(self, validated_data):
    user = self.context['request'].user
    return ProjectComment.objects.create(**validated_data, created_by=user)
