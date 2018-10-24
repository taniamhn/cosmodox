from django.contrib import admin
from . import models


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    pass


class UpdateFileInline(admin.TabularInline):
    model = models.UpdateFile

@admin.register(models.ProjectUpdate)
class ProjectUpdateAdmin(admin.ModelAdmin):
    inlines = [UpdateFileInline]
