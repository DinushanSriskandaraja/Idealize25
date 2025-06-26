from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import Order
from .serializers import OrderSerializer

class OrderCreateView(APIView):
    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()
            full_order_data=OrderSerializer(order).data
            return Response({
                'message': 'Order placed successfully',
                'order_id': full_order_data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderStatusUpdateView(UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def patch(self, request,*args, **kwargs):
        order = self.get_object()
        new_status = request.data.get('status')

        valid_statuses = [choice[0] for choice in order.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save()
        return Response({
            'message': f'Order status updated to {new_status}',
            'order_id': order.id
        }, status=status.HTTP_200_OK)
