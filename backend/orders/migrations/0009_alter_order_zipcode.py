# Generated by Django 4.1.5 on 2023-01-21 09:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0008_order_products'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='zipcode',
            field=models.CharField(max_length=7),
        ),
    ]
