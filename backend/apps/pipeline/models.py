from django.db import models

class PipelineStage(models.Model):
    """Admin-configurable pipeline stages"""
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=20, default='#3b82f6')
    order = models.PositiveIntegerField(default=0)
    is_won = models.BooleanField(default=False)
    is_lost = models.BooleanField(default=False)

    class Meta:
        ordering = ['order']
        db_table = 'crm_pipelinestage'

    def __str__(self):
        return self.name
