from rest_framework import serializers
from apps.certificate.models.Certificate import Certificate
from apps.certificate.models.ReissueLog import ReissueLog

class ReissueLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReissueLog
        fields = ['reissue_date', 'delivery_type', 'reissue_cost']

class CertificateDetailsSerializer(serializers.ModelSerializer):
    reissue_logs = ReissueLogSerializer(many=True, read_only=True)

    class Meta:
        model = Certificate
        fields = [
            'id', 'user_name', 'birth_date', 'issue_date', 'issue_number',
            'education_center', 'image_url', 'pdf_url', 'reissue_logs'
        ]
