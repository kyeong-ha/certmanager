import uuid
from django.db import models

class User(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=20, null=True, blank=True)  # 회원아이디
    user_name = models.CharField(max_length=50)  # 성명
    birth_date = models.DateField()  # 생년월일
    phone_number = models.CharField(max_length=20) # 핸드폰
    postal_code = models.CharField(max_length=20, null=True, blank=True)  # 우편번호
    address = models.TextField(null=True, blank=True)  # 주소
    image_url = models.ImageField(upload_to='images/user/', null=True, blank=True)  # 증명사진
    pdf_url = models.URLField(null=True, blank=True)
   
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-user_name']
         
    def __str__(self):
        return f'{self.user_name}({self.birth_date})'