from rest_framework import serializers
from apps.product.models import product, user

class ProductCreateSerializer(serializers.ModelSerializer):
    farmer = serializers.PrimaryKeyRelatedField(
        queryset=user.objects.filter(role='farmer'),
        default=serializers.CurrentUserDefault(),
        required=False
    )

    class Meta:
        model = product
        fields = ['id', 'name', 'description', 'price', 'stock', 'farmer', 'is_active', 'created_at', 'updated_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'is_active': {'read_only': True},  # Set by server, not client
        }

    def validate(self, data):
        # Validate price
        if data.get('price', 0) <= 0:
            raise serializers.ValidationError({"price": "Price must be greater than zero."})

        # Validate stock
        if data.get('stock', 0) < 0:
            raise serializers.ValidationError({"stock": "Stock cannot be negative."})

        # Validate farmer (if provided)
        farmer = data.get('farmer')
        if farmer and farmer.role != 'farmer':
            raise serializers.ValidationError({"farmer": "The selected user must have the 'farmer' role."})

        return data

    def create(self, validated_data):
        # Ensure is_active is True for new products
        validated_data['is_active'] = True
        return product.objects.create(**validated_data)

class ProductPurchaseSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

    def validate(self, data):
        product_id = data.get('product_id')
        quantity = data.get('quantity')

        # Check if product exists
        try:
            Product = product.objects.get(id=product_id, is_active=True)
        except product.DoesNotExist:
            raise serializers.ValidationError({"product_id": "Product not found or unavailable."})

        # Check stock availability
        if product.stock < quantity:
            raise serializers.ValidationError({
                "quantity": f"Insufficient stock. Available: {Product.stock}, Requested: {quantity}"
            })

        # Check if user is a consumer (optional, based on context)
        user = self.context.get('request').user
        if user.is_authenticated and user.role != 'consumer':
            raise serializers.ValidationError({"non_field_errors": "Only consumers can purchase products."})

        # Attach product to validated data for use in views
        data['product'] = Product
        return data