from django.shortcuts import render
from .models import Order
from .serializers import OrderSerializer, OrderProductSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import status
from drf_yasg2.utils import swagger_auto_schema
from drf_yasg2.openapi import Parameter, IN_BODY, TYPE_ARRAY, Items


class OrderListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly, ]

    @swagger_auto_schema(responses={200: OrderSerializer(many=True)})
    def get(self, request, format=None):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=OrderSerializer)
    def post(self, request, format=None):

        serializer = OrderSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly, ]

    @swagger_auto_schema(responses={200: OrderSerializer()})
    def get(self, request, order_id, format=None):
        try:
            order = Order.objects.get(order_id=order_id)
        except Order.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=OrderSerializer)
    def patch(self, request, order_id, format=None):
        order = Order.objects.get(order_id=order_id)
        serializer = OrderSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=OrderSerializer)
    def delete(self, request, id, format=None):
        order = Order.objects.get(id=id)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
