from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/lead/(?P<lead_id>\d+)/$', consumers.LeadConsumer.as_asgi()),
    re_path(r'ws/dashboard/$', consumers.DashboardConsumer.as_asgi()),
]
