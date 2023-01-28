# Generated by Django 4.1.5 on 2023-01-21 09:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0010_alter_category_options'),
        ('orders', '0006_order_payment_completed_alter_order_order_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='products',
        ),
        migrations.CreateModel(
            name='OrderProduct',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField()),
                ('order', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='orders.order')),
                ('product', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='content.product')),
            ],
        ),
    ]