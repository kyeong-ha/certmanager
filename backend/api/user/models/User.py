import uuid
from django.db import models
from utils.helpers import user_photo_upload_path

from api.center.models.EducationCenterSession import EducationCenterSession

class User(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=20, null=True, blank=True)  # 회원아이디
    user_name = models.CharField(max_length=50)  # 성명
    birth_date = models.DateField()  # 생년월일
    phone_number = models.CharField(max_length=20, unique=True) # 핸드폰
    postal_code = models.CharField(max_length=20, null=True, blank=True)  # 우편번호
    address = models.TextField(null=True, blank=True)  # 주소
    photo = models.FileField(upload_to=user_photo_upload_path, blank=True, null=True)  # 증명사진
   
    education_session = models.ManyToManyField(EducationCenterSession, related_name='users', blank=True) # 교육원명+기수
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def latest_education_session(self):
        return self.education_session.order_by('-updated_at', '-created_at').first()
    
    class Meta:
        ordering = ['-user_name']
        
    def __str__(self):
        return f'{self.user_name}({self.birth_date})'