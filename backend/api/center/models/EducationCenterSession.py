import uuid
from django.db import models
from api.center.models.EducationCenter import EducationCenter

# 교육기관별 세션(기수)
class EducationCenterSession(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    education_center = models.ForeignKey(EducationCenter, on_delete=models.SET_NULL, null=True, blank=True, related_name='sessions')
    
    center_session = models.PositiveIntegerField() # 교육기수 (숫자)
    unit_price = models.IntegerField(null=True, blank=True) # 발급비 단가
    delivery_address = models.TextField(null=True, blank=True)  # 기수별 배송주소
    tracking_numbers = models.JSONField(default=list, blank=True) # 운송장번호 List

    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.center_session}기'