from django.db import models
from content.models import Product

# Create your models here.


class ImageSettingField(models.TextChoices):
    LOGO = 'logo'
    FAVICON = 'favicon'
    BANNER = 'banner'


class TextSettingField(models.TextChoices):
    BANNER_TITLE = 'bannerTitle'
    BANNER_SUBTITLE = 'bannerSubtitle'


class ImageSetting(models.Model):
    setting = models.CharField(
        choices=ImageSettingField.choices, max_length=50, unique=True)
    value = models.ImageField(upload_to=f'website/settings/')


class TextSetting(models.Model):
    setting = models.CharField(
        max_length=50, choices=TextSettingField.choices, unique=True)
    value = models.CharField(max_length=50)


class PromotedProduct(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, unique=True)
