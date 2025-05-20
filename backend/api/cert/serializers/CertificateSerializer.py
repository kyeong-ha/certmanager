from rest_framework import serializers
from api.cert.models.Certificate import Certificate
from api.user.models.User import User
from api.center.models.EducationCenter import EducationCenter
from api.center.models.EducationCenterSession import EducationCenterSession
from api.user.serializers.UserSerializer import UserSearchSerializer
from api.center.serializers.EducationCenterSerializer import EducationCenterSearchSerializer
from api.center.serializers.EducationCenterSessionSerializer import EducationCenterSessionSummarySerializer


# 1. 자격증 요약형 목록/검색용
class CertificateSearchSerializer(serializers.ModelSerializer):
    user = UserSearchSerializer(read_only=True)
    # education_session = EducationCenterSessionSummarySerializer(read_only=True)
    center_name = serializers.CharField(source='education_session.education_center.center_name', read_only=True)
    center_session = serializers.IntegerField(source='education_session.center_session', read_only=True)

    class Meta:
        model = Certificate
        fields = [
            'uuid',
            'issue_number',
            'issue_date',
            'course_name',
            'user',
            'center_name',
            'center_session',
        ]


# 2. 생성 및 수정용
class CertificateWriteSerializer(serializers.ModelSerializer):
    user = serializers.JSONField()
    education_session = serializers.PrimaryKeyRelatedField(queryset=EducationCenterSession.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Certificate
        fields = [
            'uuid',
            'issue_number',
            'issue_date',
            'course_name',
            'issue_type',
            'copy_file',
            'delivery_address',
            'tracking_number',
            'user',
            'education_session',
        ]
    def create(self, validated_data):
        user_data = validated_data.pop("user")

        # 1. phone_number 기준으로 사용자 조회 or 생성
        user, _ = User.objects.get_or_create(
            phone_number=user_data["phone_number"],
            defaults={
                "user_name": user_data.get("user_name"),
                "birth_date": user_data.get("birth_date"),
                "postal_code": user_data.get("postal_code"),
                "address": user_data.get("address"),
                "user_id": user_data.get("user_id", None),
                "photo": user_data.get("photo", None),  # 필요 시 처리
            },
        )

        # 2. ForeignKey로 연결
        certificate = Certificate.objects.create(user=user, **validated_data)
        return certificate



# 3. 상세 조회용
class CertificateDetailSerializer(serializers.ModelSerializer):
    user = UserSearchSerializer(read_only=True)
    # education_center = EducationCenterSearchSerializer(read_only=True)
    education_session = EducationCenterSessionSummarySerializer(read_only=True)
    class Meta:
        model = Certificate
        fields = [
            'uuid',
            'issue_number',
            'issue_date',
            'course_name',
            'issue_type',
            'copy_file',
            'delivery_address',
            'tracking_number',
            'user',
            'education_session',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']