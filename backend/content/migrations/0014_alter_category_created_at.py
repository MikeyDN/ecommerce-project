# Generated by Django 4.1.5 on 2023-01-29 11:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0013_category_created_at_category_image_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
