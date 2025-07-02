from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.backends import ModelBackend
from .models import User

class ContactNumberBackend(ModelBackend):
    def authenticate(self, request, contact_number=None, password=None, **kwargs):
        try:
            user = User.objects.get(contact_number=contact_number)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'password', 'contact_number', 'address', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserLoginSerializer(serializers.Serializer):
    contact_number = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(contact_number=data['contact_number'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid login credentials")
        return user
