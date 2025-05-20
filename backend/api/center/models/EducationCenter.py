import uuid
from django.db import models

class EducationCenter(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    center_name = models.CharField(max_length=255) # 교육원명
    center_tel = models.CharField(max_length=20, null=True, blank=True) # 교육원 전화번호
    center_address = models.TextField(null=True, blank=True) # 사업자주소

    unit_price = models.IntegerField(null=True, blank=True) # 발급단가
    
    ceo_name = models.CharField(max_length=100, null=True, blank=True) # 대표자명
    ceo_mobile = models.CharField(max_length=20, null=True, blank=True) # 대표자 휴대폰번호

    manager_name = models.CharField(max_length=100, null=True, blank=True) # 담당자명
    manager_mobile = models.CharField(max_length=20, null=True, blank=True) # 담당자 휴대폰번호

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
   
    def __str__(self):
        return self.center_name
