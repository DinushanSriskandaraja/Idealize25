from django.db import models
from users.models import User
from products.models import Product

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('packed', 'Packed'),
        ('on_delivery', 'On Delivery'),
        ('delivered', 'Delivered'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Customer
    quantity = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    ordered_at = models.DateTimeField(auto_now_add=True)
    sold_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.contact_number} ordered {self.quantity} of {self.product.name}"
