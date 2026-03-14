import os
import sys
import django

sys.path.append('/root/ChatBridge-PRO/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')
django.setup()

from apps.leads.models import Setting, Lead, ChatMessage

print("--- DIAGNOSTIC REPORT ---")
print(f"wa_mode: {Setting.get('wa_mode')}")
print(f"Meta Phone ID: {Setting.get('meta_phone_id')}")
print(f"Meta Access Token (first 10): {Setting.get('meta_access_token')[:10]}...")
print(f"Total Leads: {Lead.objects.count()}")
print(f"Total Messages: {ChatMessage.objects.count()}")

# Check recent messages
recent = ChatMessage.objects.order_by('-timestamp')[:5]
print("\nRecent Messages:")
for m in recent:
    print(f"[{m.timestamp}] {m.role}: {m.content[:50]}")
