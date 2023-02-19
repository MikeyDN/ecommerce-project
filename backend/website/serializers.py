from rest_framework import serializers
from content.serializers import ProductSerializer
from orders.serializers import OrderSerializer
from .models import PromotedProduct, ImageSetting, TextSetting


class ImageSettingSerializer(serializers.ModelSerializer):

    class Meta:
        model = ImageSetting
        fields = ['setting', 'value']

    def to_representation(self, instance):
        return {instance.setting: instance.value.url}


class TextSettingSerializer(serializers.ModelSerializer):

    class Meta:
        model = TextSetting
        fields = ['setting', 'value']

    def to_representation(self, instance):
        return {instance.setting: instance.value}


class AllSettingsSerializer(serializers.Serializer):
    images = ImageSettingSerializer(many=True)
    text = TextSettingSerializer(many=True)
