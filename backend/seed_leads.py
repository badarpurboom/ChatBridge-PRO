import os
import django
import random
from datetime import timedelta
from django.utils import timezone

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.leads.models import Lead, ChatMessage
from apps.pipeline.models import PipelineStage
from apps.accounts.models import User
from apps.catalog.models import CatalogItem

def create_dummy_data():
    print("🚀 Creating dummy leads and messages...")
    
    # Get existing dependencies
    stages = list(PipelineStage.objects.all())
    agents = list(User.objects.filter(role='agent'))
    catalog_items = list(CatalogItem.objects.all())
    
    if not stages:
        print("❌ Error: No pipeline stages found. Run seed_data first.")
        return

    dummy_names = ["Rahul Sharma", "Anjali Gupta", "Vikram Singh", "Sanya Malhotra", "Kabir Das", "Ishani Roy"]
    dummy_phones = [f"91987654321{i}" for i in range(6)]
    sources = ['whatsapp', 'referral', 'instagram', 'facebook', 'website']
    
    for i in range(len(dummy_names)):
        name = dummy_names[i]
        phone = dummy_phones[i]
        
        # Check if lead already exists
        lead, created = Lead.objects.get_or_create(
            phone=phone,
            defaults={
                'name': name,
                'source': random.choice(sources),
                'stage': random.choice(stages),
                'assigned_to': random.choice(agents) if agents else None,
                'catalog_item': random.choice(catalog_items) if catalog_items else None,
                'amount': random.randint(1000, 50000),
                'notes': f"Dummy lead for testing {i+1}",
            }
        )
        
        if created:
            print(f"  ✅ Created Lead: {name}")
            # Create some chat messages
            messages = [
                ("user", "Hello, I am interested in your services."),
                ("assistant", "Hi! Thank you for reaching out. Which plan are you looking for?"),
                ("user", "I'm looking for the basic plan."),
                ("assistant", "Great! Let me share the details with you.")
            ]
            
            for role, content in messages:
                ChatMessage.objects.create(
                    lead=lead,
                    role=role,
                    content=content,
                    timestamp=timezone.now() - timedelta(minutes=random.randint(1, 60))
                )
        else:
            print(f"  ℹ️ Lead {name} already exists.")

if __name__ == "__main__":
    create_dummy_data()
