# Generated by Django 4.1.5 on 2023-02-19 21:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0015_review'),
    ]

    operations = [
        migrations.AlterField(
            model_name='review',
            name='review',
            field=models.TextField(max_length=300),
        ),
    ]
