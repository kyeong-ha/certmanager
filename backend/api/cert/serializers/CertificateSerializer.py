from django.conf import settings
from rest_framework import serializers
from api.cert.models.Certificate import Certificate
from api.edu.models.EducationCenter import EducationCenter
from api.edu.serializers.EducationCenterSerializer import EducationCenterSerializer
from api.logs.serializers.ReissueLogSerializer import ReissueLogSerializer
from api.user.models.User import User
from api.user.serializers.UserSerializer import UserSerializer

class CertificateSerializer(serializers.ModelSerializer):
    uuid = serializers.ReadOnlyField()

    user = UserSerializer(read_only=True)
    education_center = EducationCenterSerializer(read_only=True)
    reissue_logs = ReissueLogSerializer(many=True, read_only=True)

    user_uuid = serializers.UUIDField(write_only=True)
    education_center_uuid = serializers.UUIDField(write_only=True)
    
    copy_file = serializers.SerializerMethodField() 
    class Meta:
        model = Certificate
        fields = [
            'uuid', 'issue_number', 'issue_date', 'issue_type', 'copy_file',
            'course_name', 'created_at', 'updated_at',
            'user', 'user_uuid',
            'education_center', 'education_center_uuid',
            'reissue_logs',
        ]
        read_only_fields = ['created_at', 'updated_at', 'user', 'education_center', 'reissue_logs']

    def create(self, validated_data):
        user_uuid = validated_data.pop('user_uuid')
        edu_uuid = validated_data.pop('education_center_uuid')

        user = User.objects.get(uuid=user_uuid)
        education_center = EducationCenter.objects.get(uuid=edu_uuid)

        certificate = Certificate.objects.create(
            user=user,
            education_center=education_center,
            **validated_data
        )
        return certificate

    def update(self, instance, validated_data):
        if 'user_uuid' in validated_data:
            instance.user = User.objects.get(uuid=validated_data.pop('user_uuid'))
        if 'education_center_uuid' in validated_data:
            instance.education_center = EducationCenter.objects.get(uuid=validated_data.pop('education_center_uuid'))

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
    
    def get_copy_file(self, obj):
        if obj.copy_file:
            return f"{settings.BACKEND_DOMAIN}{obj.copy_file.url}"
        return None