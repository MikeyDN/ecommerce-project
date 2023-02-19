# Generated by Django 4.1.5 on 2023-02-19 17:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0006_setting_delete_website'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='setting',
            name='banner',
        ),
        migrations.RemoveField(
            model_name='setting',
            name='banner_subtitle',
        ),
        migrations.RemoveField(
            model_name='setting',
            name='banner_title',
        ),
        migrations.RemoveField(
            model_name='setting',
            name='favicon',
        ),
        migrations.RemoveField(
            model_name='setting',
            name='logo',
        ),
        migrations.AddField(
            model_name='setting',
            name='setting',
            field=models.CharField(choices=[('logo', 'Logo'), ('favicon', 'Favicon'), ('banner', 'Banner'), ('banner_title', 'Banner Title'), ('banner_subtitle', 'Banner Subtitle')], default=1, max_length=50),
            preserve_default=False,
        ),
    ]