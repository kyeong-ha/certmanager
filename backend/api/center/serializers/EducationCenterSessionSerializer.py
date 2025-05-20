from rest_framework import serializers
from api.center.models.EducationCenterSession import EducationCenterSession
from api.center.serializers.EducationCenterSerializer import EducationCenterSerializer

class EducationCenterSessionSerializer(serializers.ModelSerializer):
    education_center = EducationCenterSerializer()
    
    class Meta:
        model = EducationCenterSession
        fields = ['uuid', 'center_session', 'education_center']