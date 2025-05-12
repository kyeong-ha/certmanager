from rest_framework import serializers
from ..models.EducationCenter import EducationCenter

class EducationCenterSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationCenter
        fields = ['uuid', 'center_name']