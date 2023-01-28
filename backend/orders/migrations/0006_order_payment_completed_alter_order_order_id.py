# Generated by Django 4.1.5 on 2023-01-21 09:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0005_alter_order_phone'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='payment_completed',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='order',
            name='order_id',
            field=models.CharField(auto_created=True, blank=True, max_length=100, null=True, unique=True, verbose_name='Order ID (Optional)'),
        ),
    ]