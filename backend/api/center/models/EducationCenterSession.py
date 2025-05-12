import uuid
from django.db import models
from api.center.models.EducationCenter import EducationCenter

# 교육기관별 세션(기수)
class EducationCenterSession(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    education_center = models.ForeignKey(EducationCenter, on_delete=models.CASCADE, related_name='sessions')
    center_session = models.CharField(max_length=50, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.education_center.center_name} {self.center_session}'
