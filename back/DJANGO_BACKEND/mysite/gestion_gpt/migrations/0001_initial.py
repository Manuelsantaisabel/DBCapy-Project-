# Generated by Django 4.1.7 on 2023-06-21 16:27

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RegistroPeticionChatGPT',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('id_user_gpt', models.IntegerField()),
                ('fecha', models.DateTimeField()),
            ],
            options={
                'unique_together': {('id_user_gpt', 'fecha')},
            },
        ),
    ]