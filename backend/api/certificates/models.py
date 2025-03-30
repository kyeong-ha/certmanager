from django.db import models
class Certificate(models.Model):
    name = models.CharField(max_length=50)  # 성명
    birth_date = models.CharField(max_length=20, null=True, blank=True)  # 생년월일
    phone_number = models.CharField(max_length=20, null=True, blank=True) # 핸드폰
    course_name = models.CharField(max_length=100, null=True, blank=True) # 자격과정
    session = models.CharField(max_length=100, null=True, blank=True) # 수업회차
    issue_type = models.CharField(max_length=10, null=True, blank=True) # 분류코드 (HS || HN || S || J || N)
    issue_number = models.CharField(max_length=30, unique=True)  # 발급번호
    user_id = models.CharField(max_length=20, null=True, blank=True)  # 회원아이디
    
    issue_date = models.DateField() # 발급일자
    education_center = models.CharField(max_length=100) # 교육원명
    postal_code = models.CharField(max_length=20, null=True, blank=True)  # 우편번호
    address = models.TextField(null=True, blank=True)  # 주소
    note = models.TextField(null=True, blank=True)  # 비고
    photo = models.ImageField(null=True, blank=True)  # 증명사진
    created_at = models.DateTimeField(auto_now_add=True)  # 생성일자
    updated_at = models.DateTimeField(auto_now=True)  # 수정일자
    
    def __str__(self):
        return f"{self.name} - {self.issue_number}"
