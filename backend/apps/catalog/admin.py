from django.contrib import admin
from .models import CatalogItem

@admin.register(CatalogItem)
class CatalogItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'active')
    list_filter = ('category', 'active')
    search_fields = ('name', 'category')
