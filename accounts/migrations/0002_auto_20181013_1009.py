# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-10-13 15:09
from __future__ import unicode_literals

import accounts.managers
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
                ('objects', accounts.managers.UserManager()),
            ],
        ),
    ]
