from apps.accounts.models import User
u, _ = User.objects.get_or_create(username='admin', defaults={'email': 'admin@example.com', 'role': 'admin'})
u.set_password('admin@123')
u.is_staff = True
u.is_superuser = True
u.save()
print('SUCCESS_ADMIN_SET')
