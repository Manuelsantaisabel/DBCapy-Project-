# Generated by Django 4.1.7 on 2023-05-30 22:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0009_remove_customuser_name_alter_customuser_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='estatus',
            field=models.CharField(choices=[('regular', 'regular'), ('subscriptor', 'subscriptor'), ('subscriptro_plus', 'subscriptro_plus'), ('moderador', 'moderador'), ('normal', 'normal'), ('premium', 'premium')], default='regular', max_length=100),
        ),
    ]
