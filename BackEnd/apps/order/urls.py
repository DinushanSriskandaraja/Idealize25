from django.urls import path
from .views import OrderCreateView, OrderStatusUpdateView

urlpatterns = [
    path('place-order/', OrderCreateView.as_view(), name='place-order'),
    path('update-status/<int:pk>/', OrderStatusUpdateView.as_view(), name='update-order-status'),
]
