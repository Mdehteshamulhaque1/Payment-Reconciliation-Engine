from django.db import models

class Audit(models.Model):
    action = models.CharField(max_length=200)
    actor = models.CharField(max_length=200)
    details = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
