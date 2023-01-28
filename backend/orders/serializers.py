from rest_framework import serializers
from .models import Order, OrderProduct
from content.serializers import ProductSerializer
from content.models import Product
import json
from drf_yasg.utils import swagger_auto_schema


class OrderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProduct
        fields = ['id', 'quantity']

    # add a to_represnation method to return title, order_id, quantity, single_price and total_price
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['slug'] = instance.product.slug
        response['title'] = instance.product.title
        response['single_price'] = instance.product.price
        response['total_price'] = instance.product.price * instance.quantity
        return response

    # add a to_internal_value method to return product foreign key and quantity
    def to_internal_value(self, data):
        assert 'slug' in data, 'slug is required'
        response = super().to_internal_value(data)
        try:
            product = Product.objects.get(slug=data['slug'])
        except Product.DoesNotExist:
            raise serializers.ValidationError(
                {'slug': 'Product does not exist'})
        response['product'] = product
        response['quantity'] = data['quantity']
        return response


class OrderSerializer(serializers.ModelSerializer):
    products = OrderProductSerializer(
        many=True, source='orderproduct_set')

    class Meta:
        model = Order
        fields = ['order_id', 'name', 'email', 'address', 'city', 'phone',
                  'zipcode', 'created_at', 'updated_at', 'products', 'completed', 'payment_completed']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        order_total = 0
        for order_product in instance.orderproduct_set.all():
            order_total += order_product.product.price * order_product.quantity
        response['total'] = order_total
        return response

    def create(self, validated_data):
        products_data = validated_data.pop('orderproduct_set')
        order = Order.objects.create(**validated_data)
        if len(products_data) == 0:
            order.delete()
            raise serializers.ValidationError(
                {'products': 'Order must have at least one product'})

        for product_data in products_data:
            try:
                OrderProduct.objects.create(**product_data, order=order)
            except:
                order.delete()
                raise serializers.ValidationError(
                    {'products': 'Invalid quantity'})

        return order
