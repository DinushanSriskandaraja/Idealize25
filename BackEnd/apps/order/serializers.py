from rest_framework import serializers
from django.db import transaction
from .models import Order, OrderItem, Payment, Product
from apps.user.models import User  # your custom User model

class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductDetailSerializer()

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'status', 'transaction_id', 'created_at']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer = serializers.SerializerMethodField()
    total_amount = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    payment = PaymentSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'status', 'order_date', 'items', 'total_amount', 'payment']

    def get_customer(self, obj):
        return {
            'id': obj.customer.id,
            'name': obj.customer.name,
            'contact_number': obj.customer.contact_number,
            'address': obj.customer.address,
            'role': obj.customer.role,
        }

class OrderCreateSerializer(serializers.ModelSerializer):
    items = serializers.ListField(child=serializers.DictField())
    customer_id = serializers.IntegerField(write_only=True)
    total_amount = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    payment = PaymentSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer_id', 'status', 'order_date', 'items', 'total_amount', 'payment']

    def create(self, validated_data):
        customer_id = validated_data.pop('customer_id')
        items_data = validated_data.pop('items')

        try:
            customer = User.objects.get(id=customer_id, role='customer')
        except User.DoesNotExist:
            raise serializers.ValidationError({'customer_id': 'Consumer with this ID does not exist.'})

        with transaction.atomic():
            order = Order.objects.create(customer=customer, **validated_data)

            for item in items_data:
                product_id = item.get('product')
                quantity = item.get('quantity')

                try:
                    product = Product.objects.get(id=product_id)
                except Product.DoesNotExist:
                    raise serializers.ValidationError({'items': f'Product with id {product_id} does not exist.'})

                OrderItem.objects.create(order=order, product=product, quantity=quantity)

            order.calculate_total()

        return order

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance
