# Generated by Django 4.1.5 on 2023-02-06 19:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0013_orderclient_phone_verified_alter_orderclient_secret'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderclient',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]