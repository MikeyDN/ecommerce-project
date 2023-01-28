from django.db import models
from django.template.defaultfilters import slugify
# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(blank=True, null=True,
                            unique=True, verbose_name="Slug (Optional)")

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            to_assign = slugify(self.name)
            if Category.objects.filter(slug=to_assign).exists():
                to_assign = f'{to_assign}-{Category.objects.count()}'
            self.slug = slugify(to_assign)
        super().save(*args, **kwargs)


class Product(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(blank=True, null=True,
                            unique=True, verbose_name="Slug (Optional)")
    category = models.ManyToManyField(Category)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            to_assign = slugify(self.title)
            if Product.objects.filter(slug=to_assign).exists():
                to_assign = f'{to_assign}-{Product.objects.count()}'
            self.slug = slugify(to_assign)
        super().save(*args, **kwargs)


class Image(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='static/images/')

    def __str__(self):
        return self.product.title
