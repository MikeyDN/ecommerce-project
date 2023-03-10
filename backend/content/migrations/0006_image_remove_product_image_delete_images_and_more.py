# Generated by Django 4.1.5 on 2023-01-19 10:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0005_alter_product_slug_images'),
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='static/images/')),
            ],
        ),
        migrations.RemoveField(
            model_name='product',
            name='image',
        ),
        migrations.DeleteModel(
            name='Images',
        ),
        migrations.AddField(
            model_name='image',
            name='product',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to='content.product'),
        ),
    ]
