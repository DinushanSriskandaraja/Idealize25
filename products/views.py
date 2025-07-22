from rest_framework import generics, permissions
from .models import Product
from .serializers import ProductSerializer

class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return products owned by logged-in farmer
        return Product.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Assign the logged-in user as owner
        serializer.save(owner=self.request.user)


class ProductRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure user only accesses their own products
        return Product.objects.filter(owner=self.request.user)
