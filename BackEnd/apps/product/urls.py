from django.urls import path
from .views import (
    ProductCreateView,
    ProductDetailView,
    ProductListView,
    ProductPurchaseView,
)

urlpatterns = [
    path('list/', ProductListView.as_view(), name='product-list'),
    path('create/', ProductCreateView.as_view(), name='product-create'),
    path('detail/', ProductDetailView.as_view(), name='product-detail'),
    path('purchase/', ProductPurchaseView.as_view(), name='product-purchase'),
]
