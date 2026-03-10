"""
Management command to seed initial data for SimpleWA CRM.
Run: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from apps.pipeline.models import PipelineStage
from apps.leads.models import LeadField, Setting
from apps.catalog.models import CatalogItem
from apps.accounts.models import User


class Command(BaseCommand):
    help = 'Seed initial data for SimpleWA CRM'

    def handle(self, *args, **options):
        self.stdout.write('🌱 Seeding initial data...')

        # ── Admin user ──
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                password='admin@123',
                email='admin@simplewa.com',
                role='admin',
            )
            self.stdout.write('  ✅ Admin user created (username: admin, password: admin@123)')

        # ── Sample agents ──
        for name, pwd in [('Priya', 'priya@123'), ('Arjun', 'arjun@123'), ('Rohit', 'rohit@123')]:
            if not User.objects.filter(username=name).exists():
                User.objects.create_user(username=name, password=pwd, role='agent')
                self.stdout.write(f'  ✅ Agent {name} created (password: {pwd})')

        # ── Pipeline Stages ──
        stages = [
            ('New Lead', '#3b82f6', 0, False, False),
            ('Contacted', '#8b5cf6', 1, False, False),
            ('Interested', '#f97316', 2, False, False),
            ('Negotiation', '#eab308', 3, False, False),
            ('Won', '#25d366', 4, True, False),
            ('Lost', '#ef4444', 5, False, True),
        ]
        if not PipelineStage.objects.exists():
            for name, color, order, is_won, is_lost in stages:
                PipelineStage.objects.create(name=name, color=color, order=order, is_won=is_won, is_lost=is_lost)
            self.stdout.write(f'  ✅ {len(stages)} pipeline stages created')

        # ── Lead Fields ──
        fields = [
            ('name', 'Full Name', 'text', True, True, 0),
            ('phone', 'WhatsApp Number', 'tel', True, True, 1),
            ('email', 'Email Address', 'email', False, False, 2),
            ('address', 'Address', 'textarea', False, False, 3),
            ('amount', 'Deal Amount (₹)', 'number', False, False, 4),
            ('source', 'Lead Source', 'select', False, False, 5),
            ('notes', 'Notes', 'textarea', False, False, 6),
        ]
        if not LeadField.objects.exists():
            source_opts = ['WhatsApp', 'Referral', 'Instagram', 'Facebook', 'Website', 'Walk-in', 'Cold Call']
            for key, label, ftype, required, is_system, order in fields:
                LeadField.objects.create(
                    key=key, label=label, field_type=ftype,
                    required=required, is_system=is_system, order=order,
                    options=source_opts if key == 'source' else [],
                )
            self.stdout.write(f'  ✅ {len(fields)} lead fields created')

        # ── Catalog Items ──
        if not CatalogItem.objects.exists():
            items = [
                ('Basic Plan', 4999, 'Entry level service package', 'Service'),
                ('Premium Plan', 12999, 'Full featured package with support', 'Service'),
                ('Custom Project', 25000, 'Custom development work', 'Project'),
            ]
            for name, price, desc, cat in items:
                CatalogItem.objects.create(name=name, price=price, description=desc, category=cat)
            self.stdout.write(f'  ✅ {len(items)} catalog items created')

        # ── Default Settings ──
        defaults = [
            ('business_name', 'My Business', False),
            ('wa_mode', 'webjs', False),
            ('ai_system_prompt', 'Tum ek helpful business assistant ho. Hinglish mein baat karo. Short aur helpful replies do.', False),
            ('openai_api_key', '', True),
            ('meta_access_token', '', True),
            ('meta_phone_id', '', False),
            ('meta_verify_token', 'simplewa-verify-123', False),
        ]
        for key, value, is_secret in defaults:
            Setting.objects.get_or_create(key=key, defaults={'value': value, 'is_secret': is_secret})
        self.stdout.write(f'  ✅ Default settings created')

        self.stdout.write(self.style.SUCCESS('\n✅ Seed complete! Ab CRM ready hai.'))
        self.stdout.write('\n📋 Login credentials:')
        self.stdout.write('   Admin:  admin / admin@123')
        self.stdout.write('   Agent:  Priya / priya@123')
        self.stdout.write('   Agent:  Arjun / arjun@123')
        self.stdout.write('   Agent:  Rohit / rohit@123')
