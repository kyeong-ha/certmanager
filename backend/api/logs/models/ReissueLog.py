import uuid
from django.db import models
from django.utils import timezone
from api.cert.models.Certificate import Certificate

class ReissueLog(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    certificate_uuid = models.ForeignKey(Certificate, on_delete=models.CASCADE, related_name='reissue_logs')
    reissue_date = models.DateField(default=timezone.now)
    delivery_type = models.CharField(max_length=10, choices=[('선불', '선불'), ('착불', '착불')], default='선불')
    reissue_cost = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-reissue_date']