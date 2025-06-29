from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import PermissionDenied
from .serializers import ProductCreateSerializer, ProductPurchaseSerializer


class ProductCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Restrict to users with role "farmer"
        if request.user.role != 'farmer':
            raise PermissionDenied("Only farmers can create products.")

        serializer = ProductCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            product = serializer.save(farmer=request.user)  # Associate product with the logged-in farmer
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductPurchaseView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProductPurchaseSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            product = serializer.validated_data['product']
            quantity = serializer.validated_data['quantity']

            if product.stock < quantity:
                return Response({"error": "Not enough stock available."}, status=status.HTTP_400_BAD_REQUEST)

            # Reduce stock after successful purchase
            product.stock -= quantity
            product.save()

            return Response({
                "message": f"Successfully purchased {quantity} units of {product.name}",
                "remaining_stock": product.stock
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
