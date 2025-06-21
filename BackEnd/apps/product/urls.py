# myapp/urls.py
from django.urls import path
from .views import  ProductCreateView, ProductPurchaseView

urlpatterns = [

    path('products/', ProductCreateView.as_view(), name='product-list-create'),
    path('products/', ProductPurchaseView.as_view(), name='product-detail'),
]