import os, django, sys
sys.path.append('/root/ChatBridge-PRO/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')
django.setup()
from apps.leads.models import Setting
Setting.objects.update_or_create(key='wa_mode', defaults={'value': 'api'})
Setting.objects.update_or_create(key='meta_phone_id', defaults={'value': '951472201375555'})
Setting.objects.update_or_create(key='meta_access_token', defaults={'value': 'EAFqVDD7Qf0QBQnmQJ9A2EdL8DGmsxIov3z393W7UVniQWGVHYN0fZCMTM7fVFTJf0lnrfWh2APkmMcmOnyciymT0gFRLXLuku1CUcJPbw4nSOU7BuiVEl17mt6Nsk3KeKuqDQZB44C9ZCGjDqces7MqNGQKlZCLPvoSsiDOFLDZC41FMsfkHqJhZCj79GmxgZDZD'})
print('Settings updated')
