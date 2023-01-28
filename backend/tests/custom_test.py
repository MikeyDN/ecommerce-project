from requests import Response, post, get, patch, delete
from unittest import TestCase

SERVER_URL = 'localhost:8000'


# CATEGORY FUNCS
def get_category_list():
    return get(f'{SERVER_URL}/categories/')


def post_category(**kwargs):
    return post(f'{SERVER_URL}/categories/', json=kwargs)


def patch_category(slug, **kwargs):
    return patch(f'{SERVER_URL}/categories/{slug}/', json=kwargs)
# END CATEGORY FUNCS #


# PRODUCT FUNCS
def get_product_list():
    return get(f'{SERVER_URL}/products/')


def get_product(slug):
    return get(f'{SERVER_URL}/products/{slug}/')


def post_product(**kwargs):
    return post(f'{SERVER_URL}/products/', json=kwargs)


def patch_product(slug, **kwargs):
    return patch(f'{SERVER_URL}/products/{slug}/', json=kwargs)
# END PRODUCT FUNCS #


# ORDER FUNCS
def get_order_list():
    return get(f'{SERVER_URL}/orders/')


def post_order(**kwargs):
    return post(f'{SERVER_URL}/orders/', json=kwargs)


def patch_order(order_id, **kwargs):
    return patch(f'{SERVER_URL}/orders/{order_id}/', json=kwargs)


def get_order(order_id):
    return get(f'{SERVER_URL}/orders/{order_id}/')
# END ORDER FUNCS #


class OrderTestCase(TestCase):
    def setUp(self):
        post_product()
