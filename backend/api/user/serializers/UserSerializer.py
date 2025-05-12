from rest_framework import serializers
from ..models.User import User
from api.cert.serializers.CertificateSummarySerializer import CertificateSummarySerializer

class UserSerializer(serializers.ModelSerializer):
    certificates = CertificateSummarySerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
