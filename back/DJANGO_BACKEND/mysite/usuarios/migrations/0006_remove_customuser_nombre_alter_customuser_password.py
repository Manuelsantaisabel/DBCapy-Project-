# Generated by Django 4.1.7 on 2023-04-30 15:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0005_customuser_nombre'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='nombre',
        ),
        migrations.AlterField(
            model_name='customuser',
            name='password',
            field=models.CharField(max_length=128, verbose_name='password'),
        ),
    ]
