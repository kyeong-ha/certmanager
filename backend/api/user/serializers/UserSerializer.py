from rest_framework import serializers
from ..models.User import User
from api.cert.serializers.CertificateSearchSerializer import CertificateSearchSerializer

class UserSerializer(serializers.ModelSerializer):
    certificates = CertificateSearchSerializer(many=True, read_only=True)
    education_session = serializers.SerializerMethodField() 
    class Meta:
        model = User
        fields = '__all__'

    def get_education_session(self, obj):
        session = obj.latest_education_session
        if session and session.education_center:
            return {
                "center_name": session.education_center.center_name,
                "center_session": session.center_session
            }
        return None