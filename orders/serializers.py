from rest_framework import serializers
from .models import Order
from products.models import Product

class OrderSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.contact_number')
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = Order
        fields = ['id', 'product', 'product_name', 'user', 'quantity', 'status', 'ordered_at', 'sold_date']
