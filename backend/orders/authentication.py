from django.contrib.auth.models import User
from .models import OrderClient
from rest_framework import authentication
from rest_framework import exceptions
from rest_framework.permissions import BasePermission, SAFE_METHODS
import jwt
import logging
from keys import BACKEND_AUTH_TOKEN


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


class ClientAuthentication(BasePermission):
    def has_permission(self, request, view):
        token = request.META.get('HTTP_AUTHENTICATION')
        try:
            unverified_payload = jwt.decode(
                token, options={"verify_signature": False})
        except jwt.exceptions.DecodeError:
            raise exceptions.AuthenticationFailed('Invalid token')

        unverified_user_id = unverified_payload['user_id']
        if not token:
            return None

        try:
            user = OrderClient.objects.get(id=unverified_user_id)
        except OrderClient.DoesNotExist:
            raise exceptions.AuthenticationFailed('No such user')

        assert token

        try:
            decoded = jwt.decode(
                token, user.secret, algorithms=['HS256'])
        except jwt.exceptions.InvalidSignatureError:
            raise exceptions.AuthenticationFailed('Invalid signature')

        if decoded['phone'] != user.phone:
            raise exceptions.AuthenticationFailed(
                'Phone number does not match')

        if decoded['user_id'] != user.id:  # type: ignore
            raise exceptions.AuthenticationFailed(
                'Auth header does not match \'client\' in request body')

        return True


class ClientAuthenticationOrReadOnly(ClientAuthentication):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return super().has_permission(request, view)


class WebsiteAuthentication(ClientAuthenticationOrReadOnly):
    def has_permission(self, request, view):
        token = request.META.get('HTTP_AUTHENTICATION')
        if token == BACKEND_AUTH_TOKEN:
            return True

        return super().has_permission(request, view)
