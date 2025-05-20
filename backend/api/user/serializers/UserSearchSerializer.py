from rest_framework import serializers
from ..models.User import User
from api.center.serializers.EducationCenterSessionSerializer import EducationCenterSessionSerializer

class UserSearchSerializer(serializers.ModelSerializer):
    latest_education_session = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'uuid', 'user_id', 'user_name', 'birth_date',
            'phone_number', 'postal_code', 'address', 'photo',
            'latest_education_session',
        ]

    def get_latest_education_session(self, obj):
        session = obj.latest_education_session
        if session:
            return EducationCenterSessionSerializer(session).data
        return None