from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer

# User profile - GET and PUT
class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

# QR login view - simple example
class QRLoginView(APIView):
    def post(self, request):
        # Example: client sends {"contact_number": "94771234567"}
        contact_number = request.data.get("contact_number")
        if not contact_number:
            return Response({"error": "contact_number required"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(contact_number=contact_number).first()
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        })

# Optional: Registration endpoint
class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# Optional: Custom Login (if you want, else use JWT token_obtain_pair)
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        contact_number = request.data.get("contact_number")
        password = request.data.get("password")
        if not contact_number or not password:
            return Response({"error": "contact_number and password required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, contact_number=contact_number, password=password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        })
