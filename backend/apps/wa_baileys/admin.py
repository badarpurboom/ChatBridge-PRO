from django.contrib import admin
from .models import WhatsAppSession

@admin.register(WhatsAppSession)
class WhatsAppSessionAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'updated_at')
