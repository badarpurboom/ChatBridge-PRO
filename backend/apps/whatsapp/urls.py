from django.urls import path
from . import views

urlpatterns = [
    path('status/', views.wa_status, name='wa-status'),
    path('qr/', views.wa_qr, name='wa-qr'),
    path('disconnect/', views.wa_disconnect, name='wa-disconnect'),
    path('webhook/', views.meta_webhook, name='meta-webhook'),
]
