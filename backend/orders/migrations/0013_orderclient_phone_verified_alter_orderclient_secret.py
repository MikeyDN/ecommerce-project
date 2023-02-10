# Generated by Django 4.1.5 on 2023-01-30 11:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0012_order_client_alter_orderclient_phone'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderclient',
            name='phone_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='orderclient',
            name='secret',
            field=models.CharField(blank=True, default='', max_length=100, unique=True, verbose_name='JWT Secret (Leave Empty)'),
            preserve_default=False,
        ),
    ]