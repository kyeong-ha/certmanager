from rest_framework import serializers
from ..models.EducationCenter import EducationCenter

class EducationCenterSerializer(serializers.ModelSerializer):
    uuid = serializers.ReadOnlyField()
    class Meta:
        model = EducationCenter
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']