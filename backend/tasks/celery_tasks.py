from config.celery import app
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import logging

logger = logging.getLogger(__name__)


@app.task(bind=True, max_retries=3, default_retry_delay=5)
def process_incoming_message(self, phone: str, message_text: str, wa_message_id: str = None):
    """
    Process an incoming WhatsApp message:
    1. Find or create lead by phone
    2. Save message to DB
    3. Generate AI reply (if enabled)
    4. Send reply via WhatsApp
    5. Push real-time update via WebSocket
    """
    from apps.leads.models import Lead, ChatMessage
    from apps.pipeline.models import PipelineStage
    from services.ai_service import ai_service
    from services.wa_client import send_whatsapp_message

    try:
        # 1. Find or create lead
        lead, created = Lead.objects.get_or_create(
            phone=phone,
            defaults={
                'name': f"New Lead ({phone})",
                'source': 'whatsapp',
                'stage': PipelineStage.objects.order_by('order').first(),
            }
        )

        if created:
            logger.info(f"New lead created from WhatsApp: {phone}")

        # 2. Save incoming message
        incoming = ChatMessage.objects.create(
            lead=lead,
            role='user',
            content=message_text,
            wa_message_id=wa_message_id,
        )

        # 3. Push real-time update via WebSocket
        _push_ws_update(lead.id, {
            'type': 'new_message',
            'lead_id': lead.id,
            'message': {
                'id': incoming.id,
                'role': 'user',
                'content': message_text,
                'timestamp': incoming.timestamp.isoformat(),
            }
        })

        # 4. Generate AI reply
        ai_reply = ai_service.process(lead.id, message_text)

        if ai_reply:
            # 5. Save AI reply to DB
            outgoing = ChatMessage.objects.create(
                lead=lead,
                role='assistant',
                content=ai_reply,
            )

            # 6. Send via WhatsApp
            sent = send_whatsapp_message(phone, ai_reply)

            if sent:
                # 7. Push outgoing message via WebSocket
                _push_ws_update(lead.id, {
                    'type': 'new_message',
                    'lead_id': lead.id,
                    'message': {
                        'id': outgoing.id,
                        'role': 'assistant',
                        'content': ai_reply,
                        'timestamp': outgoing.timestamp.isoformat(),
                    }
                })

        return {'success': True, 'lead_id': lead.id}

    except Exception as exc:
        logger.error(f"process_incoming_message failed: {exc}")
        raise self.retry(exc=exc)


def process_incoming_message_sync(phone: str, message_text: str, wa_message_id: str = None):
    """
    Synchronous version of process_incoming_message for use without Redis.
    """
    from apps.leads.models import Lead, ChatMessage
    from apps.pipeline.models import PipelineStage
    from services.ai_service import ai_service
    from services.wa_client import send_whatsapp_message

    try:
        # 1. Find or create lead
        lead, created = Lead.objects.get_or_create(
            phone=phone,
            defaults={
                'name': f"New Lead ({phone})",
                'source': 'whatsapp',
                'stage': PipelineStage.objects.order_by('order').first(),
            }
        )

        if created:
            logger.info(f"New lead created from WhatsApp: {phone}")

        # 2. Save incoming message
        incoming = ChatMessage.objects.create(
            lead=lead,
            role='user',
            content=message_text,
            wa_message_id=wa_message_id,
        )

        # 3. Push real-time update via WebSocket
        _push_ws_update(lead.id, {
            'type': 'new_message',
            'lead_id': lead.id,
            'message': {
                'id': incoming.id,
                'role': 'user',
                'content': message_text,
                'timestamp': incoming.timestamp.isoformat(),
            }
        })

        # 4. Generate AI reply
        ai_reply = ai_service.process(lead.id, message_text)

        if ai_reply:
            # 5. Save AI reply to DB
            outgoing = ChatMessage.objects.create(
                lead=lead,
                role='assistant',
                content=ai_reply,
            )

            # 6. Send via WhatsApp
            sent = send_whatsapp_message(phone, ai_reply)

            if sent:
                # 7. Push outgoing message via WebSocket
                _push_ws_update(lead.id, {
                    'type': 'new_message',
                    'lead_id': lead.id,
                    'message': {
                        'id': outgoing.id,
                        'role': 'assistant',
                        'content': ai_reply,
                        'timestamp': outgoing.timestamp.isoformat(),
                    }
                })

        return {'success': True, 'lead_id': lead.id}

    except Exception as exc:
        logger.error(f"process_incoming_message_sync failed: {exc}")
        raise exc


@app.task
def send_bulk_message(lead_ids: list, message: str):
    """Send bulk message to multiple leads"""
    from apps.leads.models import Lead, ChatMessage
    from services.wa_client import send_whatsapp_message

    results = {'success': 0, 'failed': 0}
    for lead_id in lead_ids:
        try:
            lead = Lead.objects.get(id=lead_id)
            sent = send_whatsapp_message(lead.phone, message)
            if sent:
                ChatMessage.objects.create(lead=lead, role='assistant', content=message)
                results['success'] += 1
            else:
                results['failed'] += 1
        except Exception as e:
            logger.error(f"Bulk send failed for lead {lead_id}: {e}")
            results['failed'] += 1

    return results


def _push_ws_update(lead_id: int, data: dict):
    """Push update to WebSocket channel"""
    try:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"lead_{lead_id}",
            {'type': 'lead_update', 'data': data}
        )
        # Also push to global dashboard channel
        async_to_sync(channel_layer.group_send)(
            "dashboard",
            {'type': 'lead_update', 'data': data}
        )
    except Exception as e:
        logger.error(f"WebSocket push failed: {e}")
