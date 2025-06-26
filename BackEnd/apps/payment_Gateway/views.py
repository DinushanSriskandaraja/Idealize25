from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import Order, Payment
from .serializers import OrderSerializer
from django.conf import settings
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import hashlib
import logging

logger = logging.getLogger(__name__)

class OrderCreateView(APIView):

    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()
            order.calculate_total()  # Ensure this updates order.total_amount
            return Response({
                'message': 'Order placed successfully',
                'order_id': order.id,
                'total_amount': str(order.total_amount),
                'payment_id': order.payment.id if hasattr(order, 'payment') else None
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderStatusUpdateView(UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def patch(self, request,*args , **kwargs):
        order = self.get_object()
        new_status = request.data.get('status')

        valid_statuses = [choice[0] for choice in order.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save()
        serializer = self.get_serializer(order)
        return Response({
            'message': f'Order status updated to {new_status}',
            'order_id': order.id,
            'data': serializer.data
        }, status=status.HTTP_200_OK)


class ProcessPaymentView(APIView):

    def post(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id)
            payment = order.payment

            merchant_id = settings.PAYHERE_MERCHANT_ID
            merchant_secret = settings.PAYHERE_MERCHANT_SECRET
            return_url = request.build_absolute_uri('/api/payment-callback/')
            cancel_url = return_url
            notify_url = return_url
            amount = str(order.total_amount)
            currency = getattr(settings, 'PAYMENT_CURRENCY', 'LKR')
            customer = order.customer

            # Safer name split
            name_parts = customer.name.split(maxsplit=1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''

            # Generate hash
            hash_string = f"{merchant_id}{order.id}{amount}{currency}{merchant_secret}"
            payhere_hash = hashlib.md5(hash_string.encode('utf-8')).hexdigest().upper()

            context = {
                'merchant_id': merchant_id,
                'return_url': return_url,
                'cancel_url': cancel_url,
                'notify_url': notify_url,
                'order_id': str(order.id),
                'items': f"Order #{order.id}",
                'amount': amount,
                'currency': currency,
                'first_name': first_name,
                'last_name': last_name,
                'email': customer.email,
                'phone': customer.phone,
                'address': customer.address,
                'city': customer.address.split(',')[0] if ',' in customer.address else '',
                'country': 'Sri Lanka',
                'hash': payhere_hash
            }

            payment.status = 'pending'
            payment.save()

            return render(request, 'payment_form.html', context)

        except Order.DoesNotExist:
            return Response({'error': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Payment processing error: {e}")
            return Response({'error': 'Payment processing failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class PaymentCallbackView(APIView):

    def post(self, request):
        try:
            data = request.data
            merchant_id = data.get('merchant_id')
            order_id = data.get('order_id')
            payhere_amount = data.get('payhere_amount')
            payhere_currency = data.get('payhere_currency')
            status_code = data.get('status_code')
            md5sig = data.get('md5sig')

            merchant_secret = settings.PAYHERE_MERCHANT_SECRET
            hash_string = f"{merchant_id}{order_id}{payhere_amount}{payhere_currency}{status_code}{merchant_secret}"
            calculated_md5sig = hashlib.md5(hash_string.encode('utf-8')).hexdigest().upper()

            if md5sig != calculated_md5sig:
                return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

            order = Order.objects.get(id=order_id)
            payment = order.payment

            # Update payment & order statuses
            if status_code == '2':
                payment.status = 'completed'
                payment.transaction_id = data.get('payment_id')
                order.status = 'confirmed'
            elif status_code == '-2':
                payment.status = 'failed'
            elif status_code == '-1':
                payment.status = 'cancelled'
                order.status = 'cancelled'
            else:
                payment.status = 'pending'

            payment.save()
            order.save()

            response_data = {
                'message': f'Payment status updated to {payment.status}',
                'order_id': order.id,
                'payment_id': payment.id,
                'payment_status': payment.status
            }

            if 'return_url' in data or 'cancel_url' in data:
                return render(request, 'payment_status.html', {'data': response_data})
            else:
                return Response(response_data, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Callback processing error: {e}")
            return Response({'error': 'Callback processing failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
