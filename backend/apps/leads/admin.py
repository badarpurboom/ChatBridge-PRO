from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Lead, LeadField, ChatMessage, Setting, AutoAssignSetting

@admin.register(Lead)
class LeadAdmin(ImportExportModelAdmin):
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

@admin.register(AutoAssignSetting)
class AutoAssignSettingAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'enabled', 'updated_at')
    list_editable = ('enabled',)
    filter_horizontal = ('agents',)

    def has_add_permission(self, request):
        # Restrict to a single instance
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)
