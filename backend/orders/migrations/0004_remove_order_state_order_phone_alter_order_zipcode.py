# Generated by Django 4.1.5 on 2023-01-21 09:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_order_completed'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='state',
        ),
        migrations.AddField(
            model_name='order',
            name='phone',
            field=models.IntegerField(default=123, max_length=10),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='order',
            name='zipcode',
            field=models.IntegerField(max_length=7),
        ),
    ]