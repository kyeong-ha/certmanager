from rest_framework import serializers
from api.center.models.EducationCenterSession import EducationCenterSession
from api.center.serializers.EducationCenterSearchSerializer import EducationCenterSearchSerializer

class EducationCenterSessionSerializer(serializers.ModelSerializer):
    education_center = EducationCenterSearchSerializer(read_only=True)
    
    class Meta:
        model = EducationCenterSession
        fields = ['uuid', 'center_session', 'education_center']