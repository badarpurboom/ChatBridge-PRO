from rest_framework import serializers
from .models import Lead, ChatMessage, Setting, LeadField
from apps.accounts.serializers import UserSerializer

class LeadFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadField
        fields = '__all__'

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'content', 'wa_message_id', 'timestamp']
        read_only_fields = ['id', 'timestamp']

class LeadListSerializer(serializers.ModelSerializer):
    stage_name = serializers.CharField(source='stage.name', read_only=True)
    stage_color = serializers.CharField(source='stage.color', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)
    catalog_name = serializers.CharField(source='catalog_item.name', read_only=True)

    class Meta:
        model = Lead
        fields = [
            'id', 'name', 'phone', 'email', 'address', 'source',
            'stage', 'stage_name', 'stage_color',
            'amount', 'catalog_item', 'catalog_name',
            'assigned_to', 'assigned_to_name',
            'ai_enabled', 'notes', 'tags', 'custom_fields',
            'created_at', 'updated_at',
        ]

class LeadDetailSerializer(LeadListSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    assigned_to_detail = UserSerializer(source='assigned_to', read_only=True)

    class Meta(LeadListSerializer.Meta):
        fields = LeadListSerializer.Meta.fields + ['messages', 'assigned_to_detail']

class SettingSerializer(serializers.ModelSerializer):
    value = serializers.SerializerMethodField()

    class Meta:
        model = Setting
        fields = ['key', 'value', 'is_secret', 'updated_at']

    def get_value(self, obj):
        if obj.is_secret:
            return '••••••••' if obj.value else ''
        return obj.value
