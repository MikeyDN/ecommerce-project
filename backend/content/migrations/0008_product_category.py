# Generated by Django 4.1.5 on 2023-01-19 19:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0007_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='category',
            field=models.ForeignKey(
                null=True, on_delete=django.db.models.deletion.CASCADE, to='content.category'),
        ),
    ]
