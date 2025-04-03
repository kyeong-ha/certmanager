from django.db import models
from apps.certificate.models.Certificate import Certificate

class ReissueLog(models.Model):
    certificate = models.ForeignKey(Certificate, on_delete=models.CASCADE, related_name='reissue_logs')
    reissue_date = models.DateField()
    delivery_type = models.CharField(max_length=10, choices=[('선불', '선불'), ('착불', '착불')])
    reissue_cost = models.IntegerField(null=True, blank=True)