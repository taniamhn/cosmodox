# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-11-01 05:49
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='projectcomment',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterModelOptions(
            name='projectupdatecomment',
            options={'ordering': ['-created_at']},
        ),
    ]