# myapp/urls.py
from django.urls import path
from .views import  ProductCreateView, ProductPurchaseView

urlpatterns = [

    path('products/', ProductCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductPurchaseView.as_view(), name='product-detail'),
]