from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError


from rest_framework.response import Response
from rest_framework.views import APIView

from . import serializers
from .models import Order
from .serializers import OrderSerializer
from products.models import Product
from datetime import date

# Create order (by customer)
class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']
        if quantity > product.quantity:
            raise ValidationError("Insufficient product quantity.")
        serializer.save(user=self.request.user)

# List orders placed by me (as a customer)
class MyOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-ordered_at')

# List orders received by farmer
class FarmerOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(product__owner=self.request.user).order_by('-ordered_at')

# Update order status (e.g. by farmer)
class UpdateOrderStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, product__owner=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found or unauthorized"}, status=404)

        new_status = request.data.get("status")
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({"error": "Invalid status"}, status=400)

        order.status = new_status

        # Reduce product quantity and delete product if delivered
        if new_status == "delivered" and not order.sold_date:
            order.sold_date = date.today()
            product = order.product
            product.reduce_quantity(order.quantity)

        order.save()
        return Response(OrderSerializer(order).data)
