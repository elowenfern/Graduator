# Generated by Django 5.1.3 on 2024-12-10 16:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_course_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='section',
            name='course',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.course'),
        ),
    ]