from .models import OrderClient
from content.models import Product
from rest_framework.response import Response
from rest_framework import status
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from keys import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SID
import jwt


def does_product_exist(slug):
    try:
        Product.objects.get(slug=slug)
    except Product.DoesNotExist:
        return False
    return True


def send_otp(phone):
    twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    response = twilio_client.verify.v2.services(TWILIO_VERIFY_SID) \
        .verifications \
        .create(to=phone, channel='sms')
    return response


def verify_otp(phone, code):
    twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    try:
        response = twilio_client.verify.v2.services(TWILIO_VERIFY_SID) \
            .verification_checks \
            .create(to=phone, code=code)
    except TwilioRestException:
        return False
    return response


def is_authenticated(request, client_id):
    assert "authentication" in request.headers
    token = request.headers.get('authentication')

    try:
        client = OrderClient.objects.get(id=client_id)
    except OrderClient.DoesNotExist:
        return False, "client not found"

    try:
        decoded = jwt.decode(
            token, client.secret, algorithms=['HS256'])
    except jwt.exceptions.InvalidSignatureError:
        return False, "invalid signature"

    if decoded['phone'] != client.phone:
        return False, "phone number does not match"

    if decoded['user_id'] != client.id:  # type: ignore
        return False, "auth header does not match 'client' in request body"

    return True, "success"
