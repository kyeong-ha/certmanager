from rest_framework import serializers
from ..models.User import User
from api.cert.models.Certificate import Certificate

class UserSerializer(serializers.ModelSerializer):
    uuid = serializers.ReadOnlyField()
    certificates = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def get_certificates(self, obj):
        from api.cert.serializers.CertificateSerializer import CertificateSerializer
        certs = Certificate.objects.filter(user=obj)
        return CertificateSerializer(certs, many=True).data