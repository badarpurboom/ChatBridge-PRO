from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from services.wa_client import get_wa_status, get_qr_code, send_whatsapp_message
from tasks.celery_tasks import process_incoming_message, process_incoming_message_sync
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wa_status(request):
    """WhatsApp connection status"""
    status_data = get_wa_status()
    return Response(status_data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wa_qr(request):
    """Get QR code for WhatsApp Web.js scanning"""
    qr = get_qr_code()
    if qr:
        return Response({'qr': qr})
    return Response({'error': 'QR not available — already connected or wa-service not running'}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wa_disconnect(request):
    """Disconnect WhatsApp session"""
    import requests as req
    wa_url = getattr(settings, 'WA_SERVICE_URL', 'http://localhost:3000')
    try:
        resp = req.post(f"{wa_url}/disconnect", timeout=5)
        return Response({'detail': 'Disconnected'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


# ── Internal webhook (called by wa-service, not exposed to public) ──

@api_view(['POST'])
@permission_classes([AllowAny])
def internal_webhook(request):
    """
    Receives incoming WhatsApp messages from wa-service Node.js.
    Protected by X-Internal-Secret header.
    """
    # Verify internal secret
    secret = request.headers.get('X-Internal-Secret', '')
    expected = getattr(settings, 'INTERNAL_WEBHOOK_SECRET', '')
    if secret != expected:
        return Response({'error': 'Unauthorized'}, status=401)

    phone = request.data.get('phone', '').strip()
    message = request.data.get('message', '').strip()
    wa_message_id = request.data.get('wa_message_id', '')

    if not phone or not message:
        return Response({'error': 'phone and message required'}, status=400)

    # Process synchronously (since Redis/Celery might not be running on user machine)
    try:
        process_incoming_message_sync(phone, message, wa_message_id)
        logger.info(f"Processed message from {phone}: {message[:50]}")
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        return Response({'error': str(e)}, status=500)

    return Response({'queued': True, 'processed': True})


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def meta_webhook(request):
    """
    Meta Cloud API webhook endpoint.
    GET: verification challenge
    POST: incoming messages
    """
    from apps.leads.models import Setting

    if request.method == 'GET':
        # Webhook verification
        verify_token = Setting.get('meta_verify_token', 'simplewa-verify-123')
        mode = request.GET.get('hub.mode')
        token = request.GET.get('hub.verify_token')
        challenge = request.GET.get('hub.challenge')

        if mode == 'subscribe' and token == verify_token:
            return Response(int(challenge))
        return Response({'error': 'Forbidden'}, status=403)

    # Handle incoming messages
    try:
        body = request.data
        for entry in body.get('entry', []):
            for change in entry.get('changes', []):
                value = change.get('value', {})
                for msg in value.get('messages', []):
                    if msg.get('type') == 'text':
                        phone = msg.get('from', '').replace('+', '')
                        text = msg['text']['body']
                        wa_id = msg.get('id', '')
                        process_incoming_message_sync(phone, text, wa_id)
    except Exception as e:
        logger.error(f"Meta webhook error: {e}")

    return Response({'status': 'ok'})
