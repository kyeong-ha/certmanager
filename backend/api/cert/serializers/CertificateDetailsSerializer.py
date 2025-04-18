from rest_framework import serializers
from api.cert.models.Certificate import Certificate
from api.logs.serializers.ReissueLogSerializer import ReissueLogSerializer


class CertificateDetailsSerializer(serializers.ModelSerializer):
    uuid = serializers.ReadOnlyField()
    reissue_logs = ReissueLogSerializer(many=True, read_only=True)
    
    class Meta:
        model = Certificate
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
