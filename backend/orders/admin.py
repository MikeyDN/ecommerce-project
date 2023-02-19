from django.contrib import admin
from .models import Order, OrderClient, Review

# Register your models here.
admin.site.register(Order)
admin.site.register(OrderClient)
admin.site.register(Review)
