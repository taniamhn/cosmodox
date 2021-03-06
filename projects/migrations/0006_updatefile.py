# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-10-22 23:32
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import projects.models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0005_auto_20181018_2201'),
    ]

    operations = [
        migrations.CreateModel(
            name='UpdateFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('document', models.FileField(upload_to=projects.models.file_path)),
                ('update', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='files', to='projects.ProjectUpdate')),
            ],
        ),
    ]
