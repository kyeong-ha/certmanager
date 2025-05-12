from rest_framework import serializers
from api.cert.models.Certificate import Certificate
from api.user.serializers.UserSearchSerializer import UserSearchSerializer
from api.center.serializers.EducationCenterSearchSerializer import EducationCenterSearchSerializer

# 자격증 요약 Serializer (User 모델과 EducationCenter 모델도 필요한 정보만 불러옴)
class CertificateSearchSerializer(serializers.ModelSerializer):
    user = UserSearchSerializer()
    education_center = EducationCenterSearchSerializer()
    
    class Meta:
        model = Certificate
        fields = ['uuid', 'issue_number', 'course_name', 'issue_date', 'user', 'education_center']
        read_only_fields = ['created_at', 'updated_at']