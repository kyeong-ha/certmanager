from rest_framework import serializers
from apps.certificate.models.EducationCenter import EducationCenter

class EducationCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationCenter
        fields = ['id', 'name', 'session']