import uuid
from django.db import models
from api.cert.services.storage import OverwriteStorage
from utils.helpers import certificate_copy_file_upload_path

from api.edu.models.EducationCenter import EducationCenter
from api.user.models.User import User

class Certificate(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certificates')
    education_center = models.ForeignKey(EducationCenter, null=True, on_delete=models.CASCADE, related_name='certificates')
    copy_file = models.FileField(upload_to=certificate_copy_file_upload_path, storage=OverwriteStorage(), blank=True, null=True )
    
    course_name = models.CharField(max_length=100, null=True, blank=True) # 자격과정
    issue_type = models.CharField(max_length=10, null=True, blank=True) # 분류코드 (HS || HN || S || J || N)
    issue_number = models.CharField(max_length=30, unique=True)  # 발급번호
    issue_date = models.DateField() # 발급일자
    
    created_at = models.DateTimeField(auto_now_add=True)  # 생성일자
    updated_at = models.DateTimeField(auto_now=True)  # 수정일자
    
    class Meta:
        ordering = ['issue_date']
        
    def __str__(self):
        return f"{self.user.user_name}님의 '{self.course_name}' 자격증"