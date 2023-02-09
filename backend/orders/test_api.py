from django.test import TestCase, Client
from content.models import Product, Category
from django.contrib.auth.models import User
from .models import Order, OrderProduct, OrderClient
from .serializers import OrderClientSerializer
from rest_framework import status
import jwt


class OrderTestCase(TestCase):
    def __init__(self, *args, **kwargs):
        self.category_one = Category(
            name="test category",
            slug="test-category"
        )
        self.category_two = Category(
            name="test category 2",
            slug="test-category-2"
        )
        self.product_one = Product(
            title='test product',
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            price='100.00',
            quantity=10,
            slug='test-product',
        )
        self.product_two = Product(
            title='test product 2',
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            price='50.00',
            quantity=10,
            slug='test-product-2',
        )
        super().__init__(*args, **kwargs)

    def setUp(self):
        def save_objects(objlist: list):
            for obj in objlist:
                obj.save()
        self.user = User.objects.create_user(username='root', password='root')
        self.categories = Category.objects.bulk_create(
            [self.category_one, self.category_two])
        save_objects(self.categories)
        self.products = Product.objects.bulk_create([
            self.product_one,
            self.product_two
        ])
        self.products[0].category.add(self.categories[0])
        self.products[1].category.add(self.categories[1])
        save_objects(self.products)

        self.order_client = OrderClient.objects.create(
            phone='123456789',
            name='Test Client',
            email='test@email.com',
            secret='secret',
            phone_verified=True
        )

        self.order_client.save()

        self.token = jwt.encode({'user_id': self.order_client.id,  # type: ignore
                                 'phone': self.order_client.phone},
                                'secret', algorithm='HS256').decode('utf-8')

        self.client = Client(HTTP_AUTHENTICATION=self.token)
        self.client.login(username='root', password='root')
        return super().setUp()

    def test_create_order(self):

        # Create order
        response = self.client.post(
            '/orders/',
            {
                'address': 'Test Address',
                'city': 'Test City',
                'zipcode': '12345',
                'products': [
                    {
                        'slug': self.products[0].slug,
                        'quantity': 1
                    },
                    {
                        'slug': self.products[1].slug,
                        'quantity': 2
                    },
                ]
            },
            format='json',
            content_type='application/json'
        )
        # Check if response code is correct
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Check if order was created
        self.assertEqual(Order.objects.count(), 1)
        # Check if order products were created
        self.assertEqual(OrderProduct.objects.count(), 2)
        # Check if client is returned within response
        response_client = response.json()['client']
        self.assertEqual(response_client['phone'], self.order_client.phone)
        self.assertEqual(response_client['name'], self.order_client.name)
        self.assertEqual(response_client['email'], self.order_client.email)
        self.assertFalse('secret' in response_client)
        # Check if products are returned within response
        response_products = response.json()['products']
        self.assertEqual(len(response_products), 2)
        self.assertEqual(response_products[0]['slug'],
                         self.products[0].slug)
        self.assertEqual(response_products[0]['quantity'], 1)
        self.assertEqual(response_products[1]['slug'],
                         self.products[1].slug)

    def test_create_order_with_unverified_phone(self):
        self.order_client.phone_verified = False
        self.order_client.save()
        # Create order
        response = self.client.post(
            '/orders/',
            {
                'address': 'Test Address',
                'city': 'Test City',
                'zipcode': '12345',
                'products': [
                    {
                        'slug': self.products[0].slug,
                        'quantity': 1
                    },
                    {
                        'slug': self.products[1].slug,
                        'quantity': 2
                    },
                ]
            },
            format='json',
            content_type='application/json'
        )
        # Make sure that order was not created
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Order.objects.count(), 0)
        self.assertEqual(OrderProduct.objects.count(), 0)

    def test_create_order_with_invalid_product(self):
        # Create order
        response = self.client.post(
            '/orders/',
            {
                'address': 'Test Address',
                'city': 'Test City',
                'zipcode': '12345',
                'products': [
                    {
                        'slug': 'invalid-product',
                        'quantity': 1
                    },
                ]
            },
            format='json',
            content_type='application/json'
        )
        # Check if response is correct
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Check if order was created
        self.assertEqual(Order.objects.count(), 0)
        # Check if order products were created
        self.assertEqual(OrderProduct.objects.count(), 0)

    def test_create_order_with_invalid_quantity(self):
        # Create order
        response = self.client.post(
            '/orders/',
            {
                'address': 'Test Address',
                'city': 'Test City',
                'zipcode': '12345',
                'products': [
                    {
                        'slug': self.products[0].slug,
                        'quantity': 100
                    },
                ]
            },
            format='json',
            content_type='application/json'
        )
        # Check if response is correct
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Check if order was created
        self.assertEqual(Order.objects.count(), 0)
        # Check if order products were created
        self.assertEqual(OrderProduct.objects.count(), 0)

    def test_create_order_with_invalid_data(self):
        # Create order
        response = self.client.post(
            '/orders/',
            {
                'address': 'Test Address',
                'city': 'Test City',
                'zipcode': '12345',
                'products': []
            },
            format='json',
            content_type='application/json'
        )
        # Check if response is correct
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Check if order was created
        self.assertEqual(Order.objects.count(), 0)
        # Check if order products were created
        self.assertEqual(OrderProduct.objects.count(), 0)

    def test_get_order(self):
        # Create order
        self.client.post(
            '/orders/',
            {
                'address': 'Test Address',
                'city': 'Test City',
                'zipcode': '12345',
                'products': [
                    {
                        'slug': self.products[0].slug,
                        'quantity': 1
                    },
                    {
                        'slug': self.products[1].slug,
                        'quantity': 2
                    },
                ]
            },
            format='json',
            content_type='application/json'
        )
        order = Order.objects.get(client='1')
        # Get order
        response = self.client.get(
            f'/orders/{order.order_id}/', format='json', content_type='application/json')

        response_data = response.json()

        # Check if response code is correct
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if response data is correct
        self.assertEqual(response_data['address'], order.address)
        self.assertEqual(response_data['city'], order.city)
        self.assertEqual(response_data['zipcode'], order.zipcode)
        self.assertEqual(response_data['products'][0]['slug'],
                         self.products[0].slug)

    def test_get_order_with_invalid_id(self):
        # Get order
        response = self.client.get(
            '/orders/invalid-id/', format='json', content_type='application/json')
        # Check if response code is correct
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_order_with_invalid_token(self):
        # Create order
        response = self.client.post(
            '/orders/',
            {
                'address': 'Test Address',
                'city': 'Test City',
                'zipcode': '12345',
                'products': [
                    {
                        'slug': self.products[0].slug,
                        'quantity': 1
                    },
                    {
                        'slug': self.products[1].slug,
                        'quantity': 2
                    },
                ]
            },
            format='json',
            content_type='application/json',
            HTTP_AUTHENTICATION='123456789'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Order.objects.count(), 0)

    def tearDown(self) -> None:
        self.client.delete(
            f'/content/categories/{self.category_one.slug}', format='json')
        self.client.delete(
            f'/content/categories/{self.category_two.slug}', format='json')
        self.client.delete(
            f'/content/products/{self.product_one.slug}', format='json')
        self.client.delete(
            f'/content/products/{self.product_two.slug}', format='json')
        return super().tearDown()


class OrderClientTestCase(TestCase):
    def setUp(self) -> None:
        self.order_client = OrderClient.objects.create(
            name='Test Client',
            email='test@email.com',
            phone='123456789')

        self.token = OrderClientSerializer(self.order_client).data['token']
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser', password='12345')
        self.client.login(username='testuser', password='12345')
        self.superuser = User.objects.create_superuser(
            username='root', password='12345', email="test@email.com")
        self.su_client = Client()
        self.su_client.login(username='root', password='12345')

    def test_create_order_client(self):
        # Create order client
        response = self.su_client.post(
            '/orders/clients/',
            {
                'name': 'Test Client',
                'email': 'test@email.com',
                'phone': 'invalid phone'
            },
            format='json',
            content_type='application/json'
        )
        # Check if response is correct
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Check if order client was created
        self.assertEqual(OrderClient.objects.count(), 2)

    def test_create_order_client_with_invalid_data(self):
        # Create order client
        response = self.su_client.post(
            '/orders/clients/',
            {
                'name': 'Test Client',
                'email': 'testemail.com',
                'phone': '123456789'
            },
            format='json',
            content_type='application/json'
        )
        # Check if response is correct
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Make sure order client was not created
        self.assertEqual(OrderClient.objects.count(), 1)

    def test_get_order_client(self):
        # Get order client
        response = self.client.get(f'/orders/clients/{self.order_client.phone}/',  # type: ignore
                                   format='json',
                                   content_type='application/json',
                                   HTTP_AUTHENTICATION=self.token)

        response_data = response.json()

        # Check if response code is correct
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if response data is correct
        self.assertEqual(response_data['name'], self.order_client.name)
        self.assertEqual(response_data['email'], self.order_client.email)
        self.assertEqual(response_data['phone'], self.order_client.phone)

    def test_get_order_client_inavlid_phone(self):
        # Get order client
        response = self.client.get(f'/orders/clients/1234567890/',  # type: ignore
                                   format='json',
                                   content_type='application/json',
                                   HTTP_AUTHENTICATION=self.token)

        # Check if response code is correct
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_order_client_no_auth(self):
        # Get order client
        response = self.client.get(f'/orders/clients/{self.order_client.id}/',  # type: ignore
                                   format='json',
                                   content_type='application/json')

        # Check if response code is correct
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def tearDown(self) -> None:
        self.order_client.delete()
        return super().tearDown()
