from django.urls import path
from . import views

# URLConf
urlpatterns = [
    path('settings/', views.SettingsView.as_view()),
    path('settings/images/', views.ImageSettingView.as_view()),
    path('settings/text/', views.TextSettingView.as_view()),
    path('promoted/', views.PromotedProductsView.as_view()),
]
