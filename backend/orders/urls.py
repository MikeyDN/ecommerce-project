from django.urls import path
from . import views

# URLConf
urlpatterns = [
    path('', views.OrderListView.as_view()),
    path('clients/', views.OrderClientListView.as_view()),
    path('clients/<str:client_phone>/', views.OrderClientView.as_view()),
    path('otp/', views.OTPView.as_view()),
    path('reviews/', views.ReviewView.as_view()),
    path('<slug:order_id>/', views.OrderView.as_view()),
]
