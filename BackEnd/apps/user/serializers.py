from rest_framework import serializers
from .models import product, user


class ProductSerializer(serializers.ModelSerializer):
    farmer = serializers.PrimaryKeyRelatedField(queryset=user.objects.filter(role='farmer'))

    class Meta:
        model = product
        fields = ['id', 'name', 'description', 'price', 'stock', 'farmer', 'created_at', 'updated_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }

    def validate(self, data):
        # Ensure price is positive
        if data.get('price', 0) <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")

        # Ensure stock is non-negative
        if data.get('stock', 0) < 0:
            raise serializers.ValidationError("Stock cannot be negative.")

        # Validate farmer role (redundant with queryset, but added for explicitness)
        farmer = data.get('farmer')
        if farmer and farmer.role != 'farmer':
            raise serializers.ValidationError("The selected user must have the 'farmer' role.")

        return data

    def create(self, validated_data):
        # Create a new product using the validated data
        return product.objects.create(**validated_data)