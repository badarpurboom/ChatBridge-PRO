from django.contrib import admin
from .models import PipelineStage

@admin.register(PipelineStage)
class PipelineStageAdmin(admin.ModelAdmin):
    list_display = ('name', 'order', 'color', 'is_won', 'is_lost')
    list_editable = ('order', 'color', 'is_won', 'is_lost')
