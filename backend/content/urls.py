from django.urls import path
from . import views

# URLConf
urlpatterns = [
    path('products/', views.ProductListView.as_view()),
    path('products/<slug:slug>/', views.ProductView.as_view()),
    path('categories/', views.CategoryListView.as_view()),
    path('categories/<slug:slug>/', views.CategoryView.as_view()),
]