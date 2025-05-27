import uuid
from django.db import models
from api.center.models.EducationCenter import EducationCenter

class IssueStatus(models.TextChoices):
    DRAFT = "DRAFT", "작성중"
    ISSUED = "ISSUED", "발급완료"
    DELIVERED = "DELIVERED", "배송완료"


# 교육기관별 세션(기수)
class EducationCenterSession(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    education_center = models.ForeignKey(EducationCenter, on_delete=models.SET_NULL, null=True, blank=True, related_name='sessions')
    
    center_session = models.PositiveIntegerField() # 교육기수 (숫자)
    unit_price = models.IntegerField(null=True, blank=True) # 발급비 단가
    delivery_address = models.TextField(null=True, blank=True)  # 기수별 배송주소
    tracking_numbers = models.JSONField(default=list, blank=True) # 운송장번호 List
    issue_date = models.DateField(null=True, blank=True)          # 최초 발급일
    issue_count = models.PositiveIntegerField(default=0)          # 누적 발급개수
    issue_status = models.CharField(
        max_length=20, choices=IssueStatus.choices, default=IssueStatus.DRAFT
    )
    delivery_date = models.DateField(null=True, blank=True)       # 택배 발송일
    
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("education_center", "center_session")

    def __str__(self):
        return f'{self.center_session}기'