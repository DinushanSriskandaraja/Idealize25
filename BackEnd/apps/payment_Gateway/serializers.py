from rest_framework import serializers
from .models import Order, OrderItem, Customer,Payment


# Serializer for OrderItem model
class OrderItemSerializer(serializers.ModelSerializer):
    # Read-only field to display product name
    product_name = serializers.CharField(source='product.name', read_only=True)
    # Read-only field to display subtotal (price * quantity)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, source='get_subtotal', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product', 'product_name', 'quantity', 'subtotal']


# Serializer for Payment model
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['amount', 'status', 'payment_method', 'transaction_id', 'created_at', 'updated_at']
        read_only_fields = ['transaction_id', 'created_at', 'updated_at']


# Serializer for Order model
class OrderSerializer(serializers.ModelSerializer):
    # Nested serializer for order items
    items = OrderItemSerializer(many=True)
    # Nested serializer for payment details (read-only)
    payment = PaymentSerializer(read_only=True)
    # Customer ID for input (write-only)
    customer_id = serializers.IntegerField(write_only=True)
    # Read-only field for customer name
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    # Write-only field for payment method (e.g., 'card', 'paypal')
    payment_method = serializers.ChoiceField(
        choices=Payment.PAYMENT_METHOD_CHOICES,
        write_only=True
    )
    # Read-only field for total amount from order
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'customer_id',
            'customer_name',
            'status',
            'order_date',
            'total_amount',
            'items',
            'payment',
            'payment_method',
        ]
        read_only_fields = ['order_date', 'total_amount', 'payment']

    def validate(self, data):
        # Ensure customer_id exists
        customer_id = data.get('customer_id')
        try:
            Customer.objects.get(id=customer_id)
        except Customer.DoesNotExist:
            raise serializers.ValidationError({"customer_id": "Customer does not exist."})

        # Ensure items are provided and valid
        items_data = data.get('items', [])
        if not items_data:
            raise serializers.ValidationError({"items": "At least one item is required."})

        return data

    def create(self, validated_data):
        # Extract customer_id, items, and payment_method from validated data
        customer_id = validated_data.pop('customer_id')
        items_data = validated_data.pop('items')
        payment_method = validated_data.pop('payment_method')

        # Get customer instance
        customer = Customer.objects.get(id=customer_id)

        # Create order
        order = Order.objects.create(customer=customer, **validated_data)

        # Create order items
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        # Calculate total amount for the order
        total = order.calculate_total()

        # Create payment instance
        Payment.objects.create(
            order=order,
            amount=total,
            payment_method=payment_method,
            status='pending'  # Initial status, updated later by payment gateway
        )

        return order

    def update(self, instance, validated_data):
        # Update order status if provided
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        # Note: Payment status updates should be handled separately (e.g., via webhook or payment view)
        return instance