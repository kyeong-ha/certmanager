from rest_framework import serializers
from ..models.EducationCenter import EducationCenter

# 교육원 요약 Serializer (자격증 요약 또는 검색 결과용)
class EducationCenterSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationCenter
        fields = ['uuid', 'center_name', 'center_session']