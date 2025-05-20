from django.conf import settings
from rest_framework import serializers
from api.cert.models.Certificate import Certificate
from api.logs.serializers.ReissueLogSerializer import ReissueLogSerializer
from api.user.models.User import User
from api.user.serializers.UserSearchSerializer import UserSearchSerializer
from api.center.serializers.EducationCenterSessionSerializer import EducationCenterSessionSerializer


class CertificateSerializer(serializers.ModelSerializer):
    uuid = serializers.ReadOnlyField()
    user = UserSearchSerializer(read_only=True)
    user_uuid = serializers.UUIDField(write_only=True)
    education_session = EducationCenterSessionSerializer(read_only=True)
    education_center_uuid = serializers.UUIDField(write_only=True)
    reissue_logs = ReissueLogSerializer(many=True, read_only=True)
    copy_file = serializers.SerializerMethodField()
    
    class Meta:
        model = Certificate
        fields = '__all__'

    def create(self, validated_data):
        user_uuid = validated_data.pop('user_uuid')

        user = User.objects.get(uuid=user_uuid)

        certificate = Certificate.objects.create(
            user=user,
            **validated_data
        )
        return certificate

    def update(self, instance, validated_data):
        if 'user_uuid' in validated_data:
            instance.user = User.objects.get(uuid=validated_data.pop('user_uuid'))

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
    
    def get_copy_file(self, obj):
        if obj.copy_file:
            return f"{settings.BACKEND_DOMAIN}{obj.copy_file.url}"
        return None