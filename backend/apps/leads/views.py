from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
import csv
from django.http import HttpResponse

from .models import Lead, ChatMessage, Setting, LeadField
from .serializers import (
    LeadListSerializer, LeadDetailSerializer, ChatMessageSerializer,
    SettingSerializer, LeadFieldSerializer
)
from services.wa_client import send_whatsapp_message

class LeadViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['stage', 'assigned_to', 'source', 'ai_enabled']
    search_fields = ['name', 'phone', 'email']
    ordering_fields = ['created_at', 'updated_at', 'amount', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = Lead.objects.filter(is_deleted=False).select_related(
            'stage', 'assigned_to', 'catalog_item'
        )
        user = self.request.user
        if user.role == 'agent':
            qs = qs.filter(assigned_to=user)
        
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        if date_from:
            qs = qs.filter(created_at__date__gte=date_from)
        if date_to:
            qs = qs.filter(created_at__date__lte=date_to)
        return qs

    def paginate_queryset(self, queryset):
        if self.request.query_params.get('no_page') == '1':
            return None
        return super().paginate_queryset(queryset)

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return LeadDetailSerializer
        return LeadListSerializer

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': 'Admin only'}, status=403)
        lead = self.get_object()
        agent_id = request.data.get('agent_id')
        from apps.accounts.models import User
        try:
            agent = User.objects.get(id=agent_id, role='agent')
            lead.assigned_to = agent
            lead.save()
            return Response({'detail': f'Assigned to {agent.username}'})
        except User.DoesNotExist:
            return Response({'error': 'Agent not found'}, status=400)

    @action(detail=True, methods=['post'])
    def toggle_ai(self, request, pk=None):
        lead = self.get_object()
        lead.ai_enabled = not lead.ai_enabled
        lead.save()
        return Response({'ai_enabled': lead.ai_enabled})

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        lead = self.get_object()
        msgs = lead.messages.all()
        return Response(ChatMessageSerializer(msgs, many=True).data)

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        lead = self.get_object()
        text = request.data.get('message', '').strip()
        if not text:
            return Response({'error': 'Message required'}, status=400)
        msg = ChatMessage.objects.create(lead=lead, role='assistant', content=text)
        try:
            send_whatsapp_message(lead.phone, text)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        return Response(ChatMessageSerializer(msg).data)

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Admin only'}, status=403)
        qs = self.get_queryset()
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="leads_{timezone.now().date()}.csv"'
        writer = csv.writer(response)
        writer.writerow(['Name', 'Phone', 'Email', 'Stage', 'Agent', 'Amount', 'Catalog Item', 'Source', 'Address', 'Notes', 'Tags', 'Date'])
        for lead in qs:
            writer.writerow([
                lead.name, lead.phone, lead.email,
                lead.stage.name if lead.stage else '',
                lead.assigned_to.username if lead.assigned_to else '',
                lead.amount or '',
                lead.catalog_item.name if lead.catalog_item else '',
                lead.get_source_display(),
                lead.address, lead.notes,
                ', '.join(lead.tags or []),
                lead.created_at.strftime('%Y-%m-%d'),
            ])
        return response

class LeadFieldViewSet(viewsets.ModelViewSet):
    queryset = LeadField.objects.all()
    serializer_class = LeadFieldSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.is_system:
            return Response({'error': 'System fields cannot be deleted'}, status=400)
        return super().destroy(request, *args, **kwargs)

class SettingViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Admin only'}, status=403)
        settings = Setting.objects.all()
        return Response(SettingSerializer(settings, many=True).data)

    def create(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Admin only'}, status=403)
        key = request.data.get('key')
        value = request.data.get('value', '')
        is_secret = request.data.get('is_secret', False)
        obj, _ = Setting.objects.update_or_create(
            key=key,
            defaults={'value': value, 'is_secret': is_secret}
        )
        return Response(SettingSerializer(obj).data)

    def destroy(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': 'Admin only'}, status=403)
        try:
            # Look up by key instead of ID for frontend convenience
            obj = Setting.objects.get(key=pk)
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Setting.DoesNotExist:
            return Response({'error': 'Setting not found'}, status=404)

    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Admin only'}, status=403)
        settings_data = request.data.get('settings', [])
        results = []
        for item in settings_data:
            key = item.get('key')
            value = item.get('value')
            if value is None: continue 
            is_secret = item.get('is_secret', False)
            obj, _ = Setting.objects.update_or_create(
                key=key,
                defaults={'value': value, 'is_secret': is_secret}
            )
            results.append(SettingSerializer(obj).data)
        return Response(results)
