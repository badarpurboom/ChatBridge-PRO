import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.accounts.models import User
u, created = User.objects.get_or_create(username='admin', defaults={'email': 'admin@example.com', 'role': 'admin'})
u.set_password('admin@123')
u.is_staff = True
u.is_superuser = True
u.save()
print('Admin user created/updated successfully with password: admin@123')
