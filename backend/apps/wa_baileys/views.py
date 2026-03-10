from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings
from .models import WhatsAppSession
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def sync_session(request):
    """
    Called by wa-service to save/get session data.
    """
    secret = request.headers.get('X-Internal-Secret')
    if secret != settings.INTERNAL_WEBHOOK_SECRET:
        return Response({'error': 'Unauthorized'}, status=401)

    action = request.data.get('action')
    session_id = request.data.get('session_id', 'default')

    if action == 'save':
        data = request.data.get('data')
        WhatsAppSession.objects.update_or_create(
            session_id=session_id,
            defaults={'data': data}
        )
        return Response({'status': 'saved'})
    
    elif action == 'get':
        session = WhatsAppSession.objects.filter(session_id=session_id).first()
        if session:
            return Response({'data': session.data})
        return Response({'data': None})

    return Response({'error': 'Invalid action'}, status=400)
