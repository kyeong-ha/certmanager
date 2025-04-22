from rest_framework import serializers
from api.cert.models.Certificate import Certificate
from api.edu.models.EducationCenter import EducationCenter
from api.logs.serializers.ReissueLogSerializer import ReissueLogSerializer
from api.user.models.User import User
from api.user.serializers.UserSerializer import UserSerializer

class CertificateSerializer(serializers.ModelSerializer):
    uuid = serializers.ReadOnlyField()
    user = UserSerializer(read_only=True)
    education_center = serializers.SerializerMethodField()
    reissue_logs = ReissueLogSerializer(many=True, read_only=True)

    class Meta:
        model = Certificate
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def get_user(self, obj):
        from api.user.serializers.UserSerializer import UserSerializer
        return UserSerializer(obj.user).data

    def get_education_center(self, obj):
        from api.edu.serializers.EducationCenterSerializer import EducationCenterSerializer
        return EducationCenterSerializer(obj.education_center).data

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        edu_data = validated_data.pop('education_center')

        user, _ = User.objects.get_or_create(**user_data)
        education_center, _ = EducationCenter.objects.get_or_create(**edu_data)

        return Certificate.objects.create(
            user=user,
            education_center=education_center,
            **validated_data
        )

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        edu_data = validated_data.pop('education_center', None)

        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)
            instance.user.save()

        if edu_data:
            for attr, value in edu_data.items():
                setattr(instance.education_center, attr, value)
            instance.education_center.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
