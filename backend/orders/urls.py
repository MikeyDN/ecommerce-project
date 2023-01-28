from django.urls import path
from . import views

# URLConf
urlpatterns = [
    path('<slug:order_id>/', views.OrderView.as_view()),
    path('', views.OrderListView.as_view()),
]
