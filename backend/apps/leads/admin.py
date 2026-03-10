from django.contrib import admin
from .models import Lead, LeadField, ChatMessage, Setting

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'stage', 'assigned_to', 'created_at')
    list_filter = ('stage', 'assigned_to', 'source', 'created_at')
    search_fields = ('name', 'phone', 'email')

@admin.register(LeadField)
class LeadFieldAdmin(admin.ModelAdmin):
    list_display = ('label', 'key', 'field_type', 'required', 'enabled', 'order')
    list_editable = ('order', 'enabled')

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('lead', 'role', 'timestamp', 'content_snippet')
    list_filter = ('role', 'timestamp')
    
    def content_snippet(self, obj):
        return obj.content[:50]

@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    list_display = ('key', 'updated_at')
    search_fields = ('key',)
