# Generated by Django 5.1.3 on 2024-12-12 07:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_section_course'),
    ]

    operations = [
        migrations.AddField(
            model_name='college',
            name='slug',
            field=models.SlugField(blank=True, null=True, unique=True),
        ),
    ]