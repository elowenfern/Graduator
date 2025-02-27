# Generated by Django 5.1.2 on 2025-01-08 14:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='College',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('slug', models.SlugField(blank=True, null=True, unique=True)),
                ('location', models.CharField(max_length=100)),
                ('description', models.TextField(default='This is a college offering various courses and facilities.')),
                ('google_map_url', models.URLField(blank=True, null=True)),
                ('contact_number', models.CharField(blank=True, max_length=20, null=True)),
                ('year', models.PositiveIntegerField(blank=True, null=True)),
                ('ownership', models.CharField(blank=True, max_length=100, null=True)),
                ('approval', models.CharField(blank=True, max_length=100, null=True)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='college_logos/')),
                ('youtube_link', models.URLField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('semester', models.IntegerField(default=0)),
                ('years', models.IntegerField(default=0)),
                ('category', models.CharField(choices=[('science', 'Science'), ('arts', 'Arts'), ('commerce', 'Commerce'), ('engineering', 'Engineering'), ('management', 'Management'), ('medical', 'Medical'), ('pharmacy', 'Pharmacy'), ('law', 'Law'), ('agriculture', 'Agriculture'), ('paramedical', 'Paramedical'), ('design', 'Design'), ('allied health science', 'Allied Health Science'), ('veterinary', 'Veterinary')], default='science', max_length=50)),
                ('image', models.ImageField(blank=True, null=True, upload_to='course_images/')),
                ('views', models.PositiveIntegerField(default=0)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Facility',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Unnamed Facility', max_length=255)),
                ('icon', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Inquiry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(max_length=20)),
                ('message', models.TextField(blank=True, null=True)),
                ('course', models.CharField(max_length=255)),
                ('college', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_read', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='University',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('location', models.CharField(blank=True, max_length=100, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('established_year', models.IntegerField(blank=True, null=True)),
                ('website', models.URLField(blank=True, null=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='university_images/')),
            ],
        ),
        migrations.CreateModel(
            name='Blog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('colleges', models.ManyToManyField(related_name='blogs', to='api.college')),
            ],
        ),
        migrations.CreateModel(
            name='CollegeImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='college_images/')),
                ('college', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='api.college')),
            ],
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('college', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.college')),
                ('course', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.course')),
            ],
        ),
        migrations.AddField(
            model_name='college',
            name='university',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='colleges', to='api.university'),
        ),
        migrations.CreateModel(
            name='CollegeCourse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fees', models.DecimalField(decimal_places=2, max_digits=10)),
                ('college', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='college_courses', to='api.college')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='college_courses', to='api.course')),
            ],
            options={
                'unique_together': {('course', 'college')},
            },
        ),
    ]
