from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.contact_number')

    class Meta:
        model = Product
        fields = ['id', 'owner', 'name', 'quantity', 'price_per_qty', 'image', 'description']
