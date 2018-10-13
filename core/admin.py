from django.contrib import admin
from . import models

@admin.register(models.Area)
class AreaAdmin(admin.ModelAdmin):
    pass
