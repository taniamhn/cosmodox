from django.contrib import admin
from . import models


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    pass
