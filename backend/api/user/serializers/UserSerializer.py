from rest_framework import serializers
from ..models.User import User
from api.cert.serializers.CertificateSearchSerializer import CertificateSearchSerializer
from api.center.serializers.EducationCenterSearchSerializer import EducationCenterSearchSerializer

class UserSerializer(serializers.ModelSerializer):
    certificates = CertificateSearchSerializer(many=True, read_only=True)
    education_center = EducationCenterSearchSerializer()

    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
