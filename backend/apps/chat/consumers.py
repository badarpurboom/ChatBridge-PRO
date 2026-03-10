import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class LeadConsumer(AsyncWebsocketConsumer):
    """Real-time updates for a specific lead's chat"""

    async def connect(self):
        self.lead_id = self.scope['url_route']['kwargs']['lead_id']
        self.group_name = f"lead_{self.lead_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        # Client can send typing indicators etc.
        pass

    async def lead_update(self, event):
        """Forward group message to WebSocket client"""
        await self.send(text_data=json.dumps(event['data']))


class DashboardConsumer(AsyncWebsocketConsumer):
    """Real-time updates for dashboard — new leads, stage changes"""

    async def connect(self):
        self.group_name = "dashboard"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        pass

    async def lead_update(self, event):
        await self.send(text_data=json.dumps(event['data']))
