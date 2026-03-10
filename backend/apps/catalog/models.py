from django.db import models

class CatalogItem(models.Model):
    """Products/services catalog"""
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        db_table = 'crm_catalogitem'

    def __str__(self):
        return f"{self.name} — ₹{self.price}"
