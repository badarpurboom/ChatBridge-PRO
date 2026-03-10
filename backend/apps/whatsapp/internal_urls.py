from django.urls import path
from .views import internal_webhook

urlpatterns = [
    path('webhook/message/', internal_webhook, name='internal-webhook'),
]
