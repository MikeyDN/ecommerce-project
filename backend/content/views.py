from django.shortcuts import render
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from drf_yasg2.utils import swagger_auto_schema

# class ImageView(generics.ListAPIView):
#     lookup_field = 'product'
#     queryset = Image.objects.filter(product=Product)
#     serializer_class = ImageSerializer


class ProductListView(APIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,]

    @swagger_auto_schema(responses={200: ProductSerializer(many=True)})
    def get(self, request, format=None):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=ProductSerializer)
    def post(self, request, format=None):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductView(APIView):
    lookup_field = 'slug'
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,]

    @swagger_auto_schema(responses={200: ProductSerializer()})
    def get(self, request, slug, format=None):
        try:
            product = Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializer(product)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=ProductSerializer)
    def patch(self, request, slug, format=None):
        product = Product.objects.get(slug=slug)
        serializer = ProductSerializer(
            product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=ProductSerializer)
    def delete(self, request, slug, format=None):
        product = Product.objects.get(slug=slug)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CategoryListView(APIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,]

    @swagger_auto_schema(responses={200: CategorySerializer(many=True)})
    def get(self, request, format=None):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=CategorySerializer)
    def post(self, request, format=None):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryView(APIView):
    lookup_field = 'slug'
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,]

    @swagger_auto_schema(responses={200: CategorySerializer()})
    def get(self, request, slug, format=None):
        try:
            category = Category.objects.get(slug=slug)
        except Category.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = CategorySerializer(category)
        return Response(serializer.data)

    @swagger_auto_schema(responses={200: CategorySerializer()})
    def patch(self, request, slug, format=None):
        category = Category.objects.get(slug=slug)
        serializer = CategorySerializer(
            category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(responses={200: CategorySerializer()})
    def delete(self, request, slug, format=None):
        category = Category.objects.get(slug=slug)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
