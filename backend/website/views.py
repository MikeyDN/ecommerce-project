from django.shortcuts import render
from .serializers import ImageSettingSerializer, TextSettingSerializer, AllSettingsSerializer
from .models import PromotedProduct, TextSetting, ImageSetting
from rest_framework.views import APIView, Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from content.serializers import ProductSerializer
# Create your views here.


class SettingsView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly,]

    def get(self, request):
        data = {
            'images': ImageSetting.objects.all(),
            'text': TextSetting.objects.all()
        }
        serializer = AllSettingsSerializer(data)
        response = {'images': {}, 'text': {}}
        for setting in serializer.data['images']:
            response['images'] = {**response['images'], **setting}
        for setting in serializer.data['text']:
            response['text'] = {**response['text'], **setting}

        return Response(response)


class TextSettingView(APIView):
    queryset = TextSetting.objects.all()
    serializer_class = TextSettingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly,]

    def get(self, request):
        settings = TextSetting.objects.all()
        serializer = TextSettingSerializer(settings, many=True)
        response = {}
        for setting in serializer.data:
            response = {**response, **setting}
        return Response(response)


class ImageSettingView(APIView):
    queryset = ImageSetting.objects.all()
    serializer_class = ImageSettingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly,]

    def get(self, request):
        settings = ImageSetting.objects.all()
        serializer = ImageSettingSerializer(settings, many=True)
        response = {}
        for setting in serializer.data:
            response = {**response, **setting}
        return Response(response)


class PromotedProductsView(APIView):
    queryset = PromotedProduct.objects.select_related('product')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly,]

    def get(self, request):
        promoted_products = PromotedProduct.objects.select_related('product')
        promoted_products = map(lambda x: x.product, promoted_products)
        serializer = ProductSerializer(promoted_products, many=True)
        return Response(serializer.data)
