from django.contrib import admin
from .models import PromotedProduct, TextSetting, ImageSetting
# Register your models here.
admin.site.register(PromotedProduct)
admin.site.register(TextSetting)
admin.site.register(ImageSetting)
