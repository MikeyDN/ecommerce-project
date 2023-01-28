from django.test import TestCase, Client
from .models import Product, Category
from django.contrib.auth.models import User
from .serializers import ProductSerializer, CategorySerializer
from rest_framework import status


class ProductTestCase(TestCase):
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

        self.client = Client()
        self.client.login(username='root', password='root')
        return super().setUp()

    def test_product_list(self):
        response = self.client.get('/content/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), len(self.products))

    def test_product_create(self):
        response = self.client.post(
            '/content/products/',
            {
                'title': 'test product 3',
                'description': 'test product 3 description',
                'price': '100.00',
                'quantity': 10,
                'slug': 'test-product-3',
                'categories': [self.category_one.slug]
            },
            format='json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['title'], 'test product 3')
        self.assertEqual(
            response.json()['category'][0]['slug'], self.category_one.slug)

    def test_product_create_with_invalid_category(self):
        response = self.client.post(
            '/content/products/',
            {
                'title': 'test product 3',
                'description': 'test product 3 description',
                'price': '100.00',
                'quantity': 10,
                'slug': 'test-product-3',
                'categories': ['invalid-category']
            },
            format='json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_product_create_with_occupied_slug(self):
        response = self.client.post(
            '/content/products/',
            {
                'title': 'test product 3',
                'description': 'test product 3 description',
                'price': '100.00',
                'quantity': 10,
                'slug': 'test-product',
                'categories': [self.category_one.slug]
            },
            format='json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_product(self):
        response = self.client.get(
            f'/content/products/{self.products[0].slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['title'], self.products[0].title)

    def test_get_product_with_invalid_slug(self):
        response = self.client.get('/content/products/invalid-slug/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_product_update(self):
        response = self.client.patch(
            f'/content/products/{self.products[0].slug}/',
            {
                'title': 'test product 3',
                'description': 'test product 3 description',
                'price': '100.00',
                'quantity': 10,
                'slug': 'test-product-3',
            },
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['title'], 'test product 3')
        self.assertEqual(
            response.json()['category'][0]['slug'], self.category_one.slug)

    def test_product_delete(self):
        response = self.client.delete(
            f'/content/products/{self.products[0].slug}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

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


class CategoryTestCase(TestCase):
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

        self.client = Client()
        self.client.login(username='root', password='root')
        return super().setUp()

    def test_category_list(self):
        response = self.client.get('/content/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), len(self.categories))

    def test_category_create(self):
        response = self.client.post(
            '/content/categories/',
            {
                'name': 'test category 3',
                'slug': 'test-category-3'
            },
            format='json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['name'], 'test category 3')
        self.assertEqual(response.json()['slug'], 'test-category-3')

    def test_category_create_with_invalid_data(self):
        response = self.client.post(
            '/content/categories/',
            {
                'slug': 'test category 3',
            },
            format='json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_category_create_with_duplicate_slug(self):
        response = self.client.post(
            '/content/categories/',
            {
                'name': 'test category 3',
                'slug': 'test-category'
            },
            format='json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_category_detail(self):
        response = self.client.get(
            f'/content/categories/{self.categories[0].slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['name'], self.categories[0].name)
        self.assertEqual(response.json()['slug'], self.categories[0].slug)

    def test_category_update(self):
        response = self.client.patch(
            f'/content/categories/{self.categories[0].slug}/',
            {
                'name': 'test category 3',
                'slug': 'test-category-3'
            },
            format='json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['name'], 'test category 3')
        self.assertEqual(response.json()['slug'], 'test-category-3')

    def test_category_delete(self):
        response = self.client.delete(
            f'/content/categories/{self.categories[0].slug}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

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
