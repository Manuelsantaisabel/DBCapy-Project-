# Generated by Django 4.1.7 on 2023-08-14 19:28

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RegistroMensajesChatGPT',
            fields=[
                ('id_message', models.AutoField(primary_key=True, serialize=False)),
                ('id_user_gpt', models.IntegerField()),
                ('text_message', models.CharField(max_length=2000)),
                ('class_message', models.CharField(max_length=200)),
            ],
        ),
    ]
