from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserProfileView, QRLoginView, RegisterView, LoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),  # optional
    path('login/', TokenObtainPairView.as_view(), name='jwt-login'),  # recommended standard JWT login
    path('login/custom/', LoginView.as_view(), name='custom-login'),  # optional custom login
    path('qr-login/', QRLoginView.as_view(), name='qr-login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
