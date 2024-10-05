# Generated by Django 5.1.1 on 2024-10-05 05:30

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_session_sessiondata_delete_test'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameField(
            model_name='sessiondata',
            old_name='pressure_1',
            new_name='pressure_b',
        ),
        migrations.RenameField(
            model_name='sessiondata',
            old_name='pressure_2',
            new_name='pressure_l',
        ),
        migrations.RenameField(
            model_name='sessiondata',
            old_name='pressure_3',
            new_name='pressure_r',
        ),
        migrations.RenameField(
            model_name='sessiondata',
            old_name='pressure_4',
            new_name='pressure_t',
        ),
        migrations.CreateModel(
            name='UserSession',
            fields=[
                ('id', models.UUIDField(editable=False, primary_key=True, serialize=False)),
                ('session_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_sessions', to='api.session')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_sessions', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
