# Generated by Django 5.2.1 on 2025-05-12 11:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('center', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='educationcenter',
            unique_together={('center_name', 'center_session')},
        ),
    ]
