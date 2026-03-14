#!/bin/bash
cd /root/ChatBridge-PRO/backend
source venv/bin/activate
export DJANGO_SETTINGS_MODULE=config.settings.prod
python -c "
import django, os
django.setup()
from apps.leads.models import Lead
from apps.accounts.models import User
from apps.pipeline.models import PipelineStage
print('=== VPS Database Verification ===')
print(f'Total Leads     : {Lead.objects.count()}')
print(f'Total Agents    : {User.objects.filter(role=\"agent\").count()}')
print(f'Pipeline Stages : {PipelineStage.objects.count()}')
print('=== Agent List ===')
for u in User.objects.filter(username__startswith=\"test_agent\"):
    print(f'  - {u.username} [{u.role}]')
"
