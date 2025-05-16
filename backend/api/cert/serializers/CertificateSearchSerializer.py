from rest_framework import serializers
from api.cert.models import Certificate
from api.center.serializers.EducationCenterSessionSerializer import EducationCenterSessionSerializer
from api.user.serializers.UserSearchSerializer import UserSearchSerializer

# 자격증 요약 Serializer (User 모델과 EducationCenter 모델도 필요한 정보만 불러옴)
class CertificateSearchSerializer(serializers.ModelSerializer):
    user = UserSearchSerializer(read_only=True)
    education_session = EducationCenterSessionSerializer(read_only=True)
    
    class Meta:
        model = Certificate
        fields = fields = [
            'uuid', 'issue_number', 'issue_date', 'course_name',
            'user', 'education_session'
        ]
        read_only_fields = ['created_at', 'updated_at']
        
    def get_education_session(self, obj):
        session = obj.education_session
        if session and session.education_center:
            return {
                "center_name": session.education_center.center_name,
                "center_session": session.center_session
            }
        return None