from django.db import models
from django.conf import settings
from apps.pipeline.models import PipelineStage
from apps.catalog.models import CatalogItem

class LeadField(models.Model):
    """Admin-configurable lead form fields"""
    FIELD_TYPES = [
        ('text', 'Text'), ('number', 'Number'), ('tel', 'Phone'),
        ('email', 'Email'), ('textarea', 'Textarea'), ('select', 'Dropdown'),
    ]
    key = models.CharField(max_length=50, unique=True)
    label = models.CharField(max_length=100)
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES, default='text')
    options = models.JSONField(default=list, blank=True)
    required = models.BooleanField(default=False)
    enabled = models.BooleanField(default=True)
    is_system = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        db_table = 'crm_leadfield'

    def __str__(self):
        return self.label

class Lead(models.Model):
    """Core lead model"""
    SOURCE_CHOICES = [
        ('whatsapp', 'WhatsApp'), ('referral', 'Referral'), ('instagram', 'Instagram'),
        ('facebook', 'Facebook'), ('website', 'Website'), ('walk_in', 'Walk-in'),
        ('cold_call', 'Cold Call'), ('other', 'Other'),
    ]

    name = models.CharField(max_length=200, db_index=True)
    phone = models.CharField(max_length=20, unique=True, db_index=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='whatsapp')

    stage = models.ForeignKey(PipelineStage, on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    catalog_item = models.ForeignKey(CatalogItem, on_delete=models.SET_NULL, null=True, blank=True)

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='assigned_leads'
    )

    ai_enabled = models.BooleanField(default=True)
    custom_fields = models.JSONField(default=dict, blank=True)
    notes = models.TextField(blank=True)
    tags = models.JSONField(default=list, blank=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        db_table = 'crm_lead'
        indexes = [
            models.Index(fields=['phone']),
            models.Index(fields=['stage']),
            models.Index(fields=['assigned_to']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.name} ({self.phone})"

class ChatMessage(models.Model):
    """WhatsApp chat messages"""
    ROLE_CHOICES = [('user', 'User'), ('assistant', 'Assistant'), ('system', 'System')]
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    wa_message_id = models.CharField(max_length=200, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']
        db_table = 'crm_chatmessage'
        indexes = [
            models.Index(fields=['lead', 'timestamp']),
        ]

    def __str__(self):
        return f"[{self.role}] {self.content[:50]}"

class Setting(models.Model):
    """Key-value settings store"""
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    is_secret = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['key']
        db_table = 'crm_setting'

    def __str__(self):
        return self.key

    @classmethod
    def get(cls, key, default=''):
        try:
            return cls.objects.get(key=key).value
        except cls.DoesNotExist:
            return default
