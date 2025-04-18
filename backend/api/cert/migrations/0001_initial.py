# Generated by Django 5.2 on 2025-04-18 12:30

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('edu', '0001_initial'),
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Certificate',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('course_name', models.CharField(blank=True, max_length=100, null=True)),
                ('issue_type', models.CharField(blank=True, max_length=10, null=True)),
                ('issue_number', models.CharField(max_length=30, unique=True)),
                ('issue_date', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('education_center', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='certificates', to='edu.educationcenter')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='certificates', to='user.user')),
            ],
            options={
                'ordering': ['issue_date'],
            },
        ),
    ]
