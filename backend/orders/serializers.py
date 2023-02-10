from rest_framework import serializers
from .models import Order, OrderProduct, OrderClient
from content.models import Product
from orders.utils import send_otp, verify_otp, does_product_exist
import jwt
import logging
import sys


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
        assert data['quantity'] > 0, 'quantity must be greater than 0'
        response = super().to_internal_value(data)
        try:
            product = Product.objects.get(slug=data['slug'])
        except Product.DoesNotExist:
            raise serializers.ValidationError(
                {'error': 'Product with this slug does not exist', 'code': 110})
        response['product'] = product
        assert product.stock >= data['quantity'], 'Not enough stock'
        response['quantity'] = data['quantity']
        return response


class OrderSerializer(serializers.ModelSerializer):
    products = OrderProductSerializer(
        many=True, source='orderproduct_set')

    class Meta:
        model = Order
        fields = ['order_id', 'address', 'city', 'client',
                  'zipcode', 'created_at', 'updated_at', 'products', 'completed', 'payment_completed']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        order_total = 0
        for order_product in instance.orderproduct_set.all():
            order_total += order_product.product.price * order_product.quantity
        response['total'] = order_total
        client = OrderClient.objects.get(order=instance)
        response['client'] = {'name': client.name,
                              'phone': client.phone, 'email': client.email}
        return response

    def to_internal_value(self, data):
        assert 'products' in data, 'products are required'
        for product in data['products']:
            if not does_product_exist(product['slug']):
                raise serializers.ValidationError(
                    {'error': 'Product with this slug does not exist', 'code': 110})
        return super().to_internal_value(data)

    def create(self, validated_data):
        products_data = validated_data.pop('orderproduct_set')

        order = Order.objects.create(**validated_data)
        if len(products_data) == 0:
            raise serializers.ValidationError(
                {'error': 'Order must have at least one product', 'code': 111})

        client = validated_data['client']
        if client.phone_verified is False:
            raise serializers.ValidationError(
                {'error': 'Phone number not verified', 'code': 112})

        for product_data in products_data:
            # Check if product exists

            if not does_product_exist(product_data['product'].slug):
                raise serializers.ValidationError(
                    {'error': 'Product with this slug does not exist', 'code': 110})

            if product_data['product'].stock < product_data['quantity']:
                raise serializers.ValidationError(
                    {'error': 'Not enough stock', 'code': 113})
            try:
                OrderProduct.objects.create(**product_data, order=order)
            except Exception as e:
                raise serializers.ValidationError(
                    {'error': e, 'code': 114})
        return order


class OrderClientSerializer(serializers.ModelSerializer):
    orders = OrderSerializer(many=True, read_only=True)

    class Meta:
        model = OrderClient
        fields = ['id', 'name', 'phone', 'email', 'secret', 'orders',
                  'created_at', 'updated_at']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        user_id = response['id']
        phone = response['phone']
        secret = response.pop('secret')
        # response['token'] = jwt.encode(
        #    {'user_id': user_id, 'phone': phone}, secret, algorithm='HS256')
        return response

    def to_internal_value(self, data):
        response = super().to_internal_value(data)
        return response


class OTPSerializer(serializers.Serializer):
    otp = serializers.CharField(
        max_length=6, min_length=6, write_only=True, required=False)

    phone = serializers.CharField(
        max_length=20, min_length=10, write_only=True, required=True)

    class Meta:
        fields = ['otp', 'phone']

    def save(self, *args, **kwargs):
        self.validate(self.validated_data)
        data = self.validated_data
        assert 'phone' in data  # type: ignore
        try:
            client = OrderClient.objects.get(
                phone=data['phone'])  # type: ignore
        except OrderClient.DoesNotExist:
            return serializers.ValidationError({'status': 'failed',
                                                'message': 'Client with given phone number does not exist',
                                                'code': 2})
        if 'otp' in data:  # type: ignore
            verification = verify_otp(
                data['phone'], data['otp'])  # type: ignore

            if not verification:
                raise serializers.ValidationError(
                    {'status': 'failed', 'message': 'No verification found', 'code': 3})

            if verification.status != 'approved':
                return {
                    'status': 'failed',
                    'message': 'Wrong OTP code',
                    'code': 4
                }

            client.regenerate_secret()

            client.phone_verified = True
            client.save()

            serialized_client = OrderClientSerializer(client)
            token = jwt.encode(
                {'user_id': client.id, 'phone': client.phone}, client.secret, algorithm='HS256')
            response = {
                'status': 'success',
                'message': 'OTP verified',
                'code': 0,
                'client': serialized_client.data,
                'token': token
            }

            return response

        else:
            phone = data['phone']  # type: ignore
            try:
                client = OrderClient.objects.get(phone=phone)
            except OrderClient.DoesNotExist:
                return {
                    'status': 'failed',
                    'message': 'Client with given phone number does not exist',
                    'code': 1
                }

            try:
                send_otp(data['phone'])  # type: ignore
            except Exception as e:
                raise serializers.ValidationError({'error': str(e)})

            response = {
                'status': 'success',
                'message': 'OTP sent',
                'code': 0
            }

            return response
