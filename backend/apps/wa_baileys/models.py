from django.db import models

class WhatsAppSession(models.Model):
    session_id = models.CharField(max_length=100, unique=True, default="default")
    data = models.JSONField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"WhatsApp Session: {self.session_id}"
