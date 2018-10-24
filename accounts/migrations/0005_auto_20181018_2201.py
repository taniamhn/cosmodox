# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-10-19 03:01
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_auto_20181013_2102'),
    ]

    operations = [
        migrations.AlterField(
            model_name='researchgroup',
            name='owner',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='research_group', to=settings.AUTH_USER_MODEL),
        ),
    ]