from rest_framework import serializers
from .models import Order, OrderItem, Customer, Payment


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'status', 'transaction_id', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer_id = serializers.IntegerField(write_only=True)
    total_amount = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    payment = PaymentSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer_id', 'status', 'order_date', 'items', 'total_amount', 'payment']

    def create(self, validated_data):
        customer_id = validated_data.pop('customer_id')
        items_data = validated_data.pop('items')
        customer = Customer.objects.get(id=customer_id)
        order = Order.objects.create(customer=customer, **validated_data)
        for item in items_data:
            OrderItem.objects.create(order=order, **item)

        # Recalculate total after adding items
        order.calculate_total()
        return order

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance
