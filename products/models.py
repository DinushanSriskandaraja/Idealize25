from django.db import models
from users.models import User

class Product(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=100)
    quantity = models.FloatField()
    price_per_qty = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    description = models.TextField(blank=True)

    def reduce_quantity(self, amount):
        if amount > self.quantity:
            raise ValueError("Not enough quantity in stock")
        self.quantity -= amount
        if self.quantity <= 0:
            self.delete()
        else:
            self.save()

    def __str__(self):
        return f"{self.name} ({self.quantity})"
