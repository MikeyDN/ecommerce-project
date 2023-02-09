from django.shortcuts import render
from .models import Order, OrderClient
from .serializers import OrderSerializer, OTPSerializer, OrderClientSerializer
from .authentication import ClientAuthentication, ClientAuthenticationOrReadOnly, ReadOnly, WebsiteAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
import jwt
from rest_framework import status
from .utils import is_authenticated
from drf_yasg.utils import swagger_auto_schema


class OrderListView(APIView):
    permission_classes = [WebsiteAuthentication, ]

    @swagger_auto_schema(responses={200: OrderSerializer(many=True)})
    def get(self, request, format=None):
        if request.GET.get('phone'):
            client = OrderClient.objects.get(phone=request.GET.get('phone'))
            orders = Order.objects.filter(client=client)
        else:
            orders = Order.objects.all()

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=OrderSerializer)
    def post(self, request, format=None):
        token = request.headers.get('Authentication').encode('utf-8')
        unverified_data = jwt.decode(
            token, options={'verify_signature': False})
        try:
            client = OrderClient.objects.get(id=unverified_data['user_id'])
        except OrderClient.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        decoded = jwt.decode(token, client.secret, algorithms=['HS256'])
        request.data['client'] = decoded['user_id']  # type: ignore
        serializer = OrderSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderView(APIView):
    permission_classes = [WebsiteAuthentication, ]

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


class OrderClientListView(APIView):
    permission_classes = [WebsiteAuthentication, ]

    @swagger_auto_schema(responses={200: OrderClientSerializer(many=True)})
    def get(self, request, format=None):
        clients = OrderClient.objects.all()
        serializer = OrderClientSerializer(clients, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=OrderClientSerializer)
    def post(self, request, format=None):
        serializer = OrderClientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'error': {'message': serializer.errors}}, status=status.HTTP_400_BAD_REQUEST)


class OrderClientView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly, ]

    @swagger_auto_schema(responses={200: OrderClientSerializer(many=True)})
    def get(self, request, client_phone, format=None):
        try:
            client = OrderClient.objects.get(phone=client_phone)
        except OrderClient.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = OrderClientSerializer(client)
        response = Response(serializer.data)
        return response


class OTPView(APIView):
    permission_classes = [ClientAuthenticationOrReadOnly | IsAdminUser,]

    @swagger_auto_schema(request_body=OTPSerializer)
    def post(self, request, format=None):

        serializer = OTPSerializer(data=request.data)

        if serializer.is_valid():
            response = serializer.save()
            return Response(response, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
