from django.db import models
from secrets import token_urlsafe
# Create your models here.


class Order(models.Model):
    order_id = models.CharField(max_length=100, unique=True, auto_created=True,
                                verbose_name="Order ID (Optional)", blank=True, null=True)
    client = models.ForeignKey(
        'OrderClient', on_delete=models.CASCADE)
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=7)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    products = models.ManyToManyField(
        'content.Product', through='OrderProduct')
    payment_completed = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.order_id

    def save(self, *args, **kwargs):
        if not self.order_id:
            self.order_id = f'ORDER-{Order.objects.count() + 1}'
        super().save(*args, **kwargs)


class OrderProduct(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(
        'content.Product', on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return self.product.title

    def save(self, *args, **kwargs):
        if self.quantity > self.product.stock:
            raise ValueError('Product out of stock')
        super().save(*args, **kwargs)


class OrderClient(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=14, unique=True)
    phone_verified = models.BooleanField(default=False)
    secret = models.CharField(
        max_length=100, unique=True, blank=True, verbose_name="JWT Secret (Leave Empty)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def regenerate_secret(self):
        self.secret = token_urlsafe(32)  # 256 bits
        self.save()

    def save(self, *args, **kwargs):
        # Every time a client is updated new secret is generated
        if not self.secret:
            self.secret = token_urlsafe(32)  # 256 bits
        super().save(*args, **kwargs)
