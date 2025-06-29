# myapp/urls.py
from django.urls import path
from .views import  ProductCreateView, ProductPurchaseView

urlpatterns = [

    path('create/', ProductCreateView.as_view(), name='product-list-create'),
    path('purchase/', ProductPurchaseView.as_view(), name='product-detail'),
]