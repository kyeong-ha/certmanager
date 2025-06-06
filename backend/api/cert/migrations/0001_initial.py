# Generated by Django 5.2.1 on 2025-05-27 00:36

import api.cert.services.storage
import django.db.models.deletion
import utils.helpers
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('center', '0001_initial'),
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
                ('copy_file', models.FileField(blank=True, null=True, storage=api.cert.services.storage.OverwriteStorage(), upload_to=utils.helpers.certificate_copy_file_upload_path)),
                ('delivery_address', models.TextField(blank=True, null=True)),
                ('tracking_number', models.CharField(blank=True, max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('education_center', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='center.educationcenter')),
                ('education_session', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='certificates', to='center.educationcentersession')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='certificates', to='user.user')),
            ],
            options={
                'ordering': ['issue_date'],
            },
        ),
    ]
