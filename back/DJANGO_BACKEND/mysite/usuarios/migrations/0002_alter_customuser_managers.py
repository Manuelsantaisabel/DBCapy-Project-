# Generated by Django 4.1.7 on 2023-04-14 10:46

from django.db import migrations
import usuarios.models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='customuser',
            managers=[
                ('objects', usuarios.models.Comprobador_Usuarios()),
            ],
        ),
    ]
