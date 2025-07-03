from django.urls import path
from .views import OrderCreateView, OrderStatusUpdateView, OrderDetailView

urlpatterns = [
    path('place-order/', OrderCreateView.as_view(), name='place-order'),
    path('update-status/<int:id>/', OrderStatusUpdateView.as_view(), name='update-order-status'),
    path('detail/<int:id>/', OrderDetailView.as_view(), name='order-detail'),
]
