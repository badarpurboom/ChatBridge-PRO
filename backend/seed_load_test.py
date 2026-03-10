import os
import django
import random
from datetime import datetime, timedelta, timezone as dt_timezone
import uuid

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.leads.models import Lead, ChatMessage
from apps.pipeline.models import PipelineStage
from apps.accounts.models import User
from apps.catalog.models import CatalogItem

def seed_load_test():
    print("Starting Load Test Seeding...")
    
    # 1. Create 5 Agents
    agents = []
    for i in range(1, 6):
        username = f"test_agent_{i}"
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'role': 'agent',
                'phone': f"999990000{i}"
            }
        )
        if created:
            user.set_password("password123")
            user.save()
            print(f"  Created Agent: {username}")
        else:
            print(f"  Agent {username} already exists")
        agents.append(user)

    # 2. Get dependencies
    stages = list(PipelineStage.objects.all())
    if not stages:
        print("Error: No pipeline stages found. Please run seed_data first.")
        return

    # 3. Generate 3000 Leads
    print("Generating 3000 Leads...")
    leads_to_create = []
    
    # Date range: March 1 to March 10, 2026
    start_date = datetime(2026, 3, 1, tzinfo=dt_timezone.utc)
    end_date = datetime(2026, 3, 10, tzinfo=dt_timezone.utc)
    delta = end_date - start_date

    sources = ['whatsapp', 'referral', 'instagram', 'facebook', 'website', 'walk_in', 'cold_call']
    
    existing_phones = set(Lead.objects.values_list('phone', flat=True))
    
    count = 0
    while count < 3000:
        phone = f"91{random.randint(6000000000, 9999999999)}"
        if phone in existing_phones:
            continue
            
        existing_phones.add(phone)
        random_days = random.random() * delta.days
        random_seconds = random.random() * 86400
        created_at = start_date + timedelta(days=int(random_days), seconds=int(random_seconds))
        
        lead = Lead(
            name=f"LoadTest User {count + 1}",
            phone=phone,
            email=f"user_{count}@example.test",
            source=random.choice(sources),
            stage=random.choice(stages),
            assigned_to=random.choice(agents),
            amount=random.randint(500, 100000),
            notes=f"Automated load test lead #{count + 1}",
            created_at=created_at
        )
        leads_to_create.append(lead)
        count += 1
        
        if len(leads_to_create) >= 500:
            Lead.objects.bulk_create(leads_to_create)
            print(f"  Created {count} leads...")
            leads_to_create = []

    if leads_to_create:
        Lead.objects.bulk_create(leads_to_create)
    
    print(f"Successfully added 3000 leads and verified 5 agents.")

if __name__ == "__main__":
    seed_load_test()
