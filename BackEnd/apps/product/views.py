from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import ProductCreateSerializer, ProductPurchaseSerializer
from rest_framework.exceptions import PermissionDenied


class ProductCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Restrict to farmers
        if request.user.role != 'farmer':
            raise PermissionDenied("Only farmers can create products.")

        serializer = ProductCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            product = serializer.save(farmer=request.user)  # Ensure farmer is set to authenticated user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductPurchaseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProductPurchaseSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            product = serializer.validated_data['product']
            quantity = serializer.validated_data['quantity']

            # Simulate purchase (e.g., reduce stock)
            product.stock -= quantity
            product.save()

            return Response({
                "message": f"Successfully purchased {quantity} units of {product.name}",
                "remaining_stock": product.stock
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)