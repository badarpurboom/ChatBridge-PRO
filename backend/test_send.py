import os, django, sys
sys.path.append('/root/ChatBridge-PRO/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')
django.setup()
from services.wa_client import send_whatsapp_message
print('Sending...')
res = send_whatsapp_message('919217211887', 'Test from CRM VPS code (Final Check)')
print('Send result:', res)
