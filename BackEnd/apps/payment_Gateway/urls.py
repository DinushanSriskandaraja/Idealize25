from django.urls import path
from .views import OrderCreateView, OrderStatusUpdateView, ProcessPaymentView, PaymentCallbackView

urlpatterns = [
    # Endpoint to create a new order with items and initiate payment
    path('place-order/', OrderCreateView.as_view(), name='place-order'),
    # Endpoint to update the status of an existing order
    path('update-status/<int:pk>/', OrderStatusUpdateView.as_view(), name='update-order-status'),
    # Endpoint to process payment for an order (e.g., using Stripe or PayPal)
    path('process-payment/<int:order_id>/', ProcessPaymentView.as_view(), name='process-payment'),
    # Endpoint to handle payment gateway webhooks (e.g., payment status updates)
    path('payment-webhook/', PaymentCallbackView.as_view(), name='payment-webhook'),
]