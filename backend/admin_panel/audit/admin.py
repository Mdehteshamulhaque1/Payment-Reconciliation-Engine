from django.contrib import admin
from .models import Audit

@admin.register(Audit)
class AuditAdmin(admin.ModelAdmin):
    list_display = ('action','actor','created_at')
