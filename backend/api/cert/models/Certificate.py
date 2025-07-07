import uuid
from django.db import models
from api.cert.services.storage import OverwriteStorage
from utils.helpers import certificate_copy_file_upload_path, certificate_photo_upload_to
import os
from api.user.models import User
from api.center.models.EducationCenter import EducationCenter
from api.center.models.EducationCenterSession import EducationCenterSession

class Certificate(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course_name = models.CharField(max_length=100, null=True, blank=True) # 자격과정
    issue_type = models.CharField(max_length=10, null=True, blank=True) # 분류코드 (HS || HN || S || J || N)
    issue_number = models.CharField(max_length=30, unique=True)  # 발급번호
    issue_date = models.DateField() # 발급일자
    copy_file = models.FileField(upload_to=certificate_copy_file_upload_path, storage=OverwriteStorage(), blank=True, null=True )
    delivery_address = models.TextField(null=True, blank=True)  # 배송주소 (User 모델의 Address을 상속)
    tracking_number = models.CharField(max_length=100, null=True, blank=True)  # 운송장번호
    memo = models.TextField(null=True, blank=True, help_text="비고 (선택)")
    
    is_online = models.BooleanField(default=False, help_text="온라인교육 여부")
    photo = models.ImageField(upload_to=certificate_photo_upload_to, blank=True, null=True, help_text="증명사진 (선택)")
   
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certificates')# 자격증 소유자
    education_center = models.ForeignKey(EducationCenter, on_delete=models.SET_NULL, null=True) #교육기관
    education_session = models.ForeignKey(EducationCenterSession, on_delete=models.SET_NULL, null=True, blank=True, related_name='certificates') # 교육기수
    
    data_hash    = models.CharField(max_length=64, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)  # 생성일자
    updated_at = models.DateTimeField(auto_now=True)  # 수정일자
    
    class Meta:
        ordering = ['issue_date']
        
    def __str__(self):
        return f"{self.user.user_name}님의 '{self.course_name}' 자격증"