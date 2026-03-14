import requests
import logging
from django.conf import settings
from apps.leads.models import Setting

logger = logging.getLogger(__name__)


def send_whatsapp_message(phone: str, text: str) -> bool:
    """
    Send WhatsApp message.
    Mode is determined by 'wa_mode' setting: 'webjs' (Baileys) or 'api' (Official Meta)
    """
    mode = Setting.get('wa_mode', 'webjs')

    if mode == 'webjs':
        return _send_via_webjs(phone, text)
    elif mode == 'api':
        return _send_via_meta_api(phone, text)
    else:
        logger.error(f"Unknown wa_mode: {mode}")
        return False


def _send_via_webjs(phone: str, text: str) -> bool:
    """Send via Node.js Baileys microservice"""
    wa_url = getattr(settings, 'WA_SERVICE_URL', 'http://localhost:3000')
    secret = getattr(settings, 'INTERNAL_WEBHOOK_SECRET', '')

    try:
        resp = requests.post(
            f"{wa_url}/send",
            json={'phone': phone, 'message': text},
            headers={'X-Internal-Secret': secret},
            timeout=10
        )
        resp.raise_for_status()
        logger.info(f"Baileys message sent to {phone}")
        return True
    except requests.RequestException as e:
        logger.error(f"Baileys send failed: {e}")
        return False


# Send via Meta API directly
def _send_via_meta_api(phone: str, text: str) -> bool:
    """Send via Meta Cloud API (official)"""
    access_token = Setting.get('meta_access_token')
    phone_id = Setting.get('meta_phone_id')

    if not access_token or not phone_id:
        logger.error("Meta API credentials not configured")
        return False

    # Format phone number (add country code if needed)
    if not phone.startswith('+') and not phone.startswith('91'):
        phone = f"91{phone}"

    try:
        resp = requests.post(
            f"https://graph.facebook.com/v18.0/{phone_id}/messages",
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json',
            },
            json={
                'messaging_product': 'whatsapp',
                'to': phone,
                'type': 'text',
                'text': {'body': text}
            },
            timeout=10
        )
        resp.raise_for_status()
        logger.info(f"Meta API message sent to {phone}")
        return True
    except requests.RequestException as e:
        logger.error(f"Meta API send failed: {e}")
        return False


def get_wa_status() -> dict:
    """Get WhatsApp connection status from wa-service"""
    wa_url = getattr(settings, 'WA_SERVICE_URL', 'http://localhost:3000')
    try:
        resp = requests.get(f"{wa_url}/status", timeout=5)
        return resp.json()
    except Exception:
        return {'status': 'disconnected', 'error': 'wa-service not running'}


def get_qr_code() -> str | None:
    """Get QR code from wa-service for scanning"""
    wa_url = getattr(settings, 'WA_SERVICE_URL', 'http://localhost:3000')
    try:
        resp = requests.get(f"{wa_url}/qr", timeout=5)
        data = resp.json()
        return data.get('qr')
    except Exception:
        return None
