from django.urls import path
from . import views

urlpatterns = [
    path('sync/', views.sync_session, name='session_sync'),
]
