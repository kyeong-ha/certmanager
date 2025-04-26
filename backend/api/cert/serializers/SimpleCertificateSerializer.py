from rest_framework import serializers
from api.cert.models.Certificate import Certificate

class SimpleCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ['uuid', 'issue_number', 'issue_date', 'course_name']
        read_only_fields = ['created_at', 'updated_at']