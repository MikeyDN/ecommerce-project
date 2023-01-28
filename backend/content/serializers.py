from rest_framework import serializers
from .models import Product, Image, Category


class ImageSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all())

    class Meta:
        model = Image
        fields = ['product', 'image']

    def to_representation(self, instance):
        return super().to_representation(instance)['image']


class ProductSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True, source='image_set')
    categories = serializers.SlugRelatedField(
        queryset=Category.objects.all(),
        many=True,
        write_only=True,
        source='category',
        slug_field='slug'
    )

    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'quantity',
                  'created_at', 'updated_at', 'slug', 'images', 'categories']

    def to_representation(self, instance):
        new = super().to_representation(instance)
        new['category'] = Category.objects.filter(
            product=instance).values('id', 'name', 'slug')
        return new


class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(
        many=True, read_only=True, source='product_set')

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'products']
