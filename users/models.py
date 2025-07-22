from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, contact_number, password=None, **extra_fields):
        if not contact_number:
            raise ValueError("Contact number is required")
        user = self.model(contact_number=contact_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, contact_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if not password:
            raise ValueError('Superusers must have a password.')
        return self.create_user(contact_number, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    contact_number = models.CharField(primary_key=True, max_length=15, unique=True)
    name = models.CharField(max_length=100)
    nic = models.CharField(max_length=12)
    address = models.TextField(blank=True)
    role = models.CharField(max_length=10, choices=(('farmer', 'Farmer'), ('customer', 'Customer')))
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # for admin site access

    USERNAME_FIELD = 'contact_number'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.contact_number
