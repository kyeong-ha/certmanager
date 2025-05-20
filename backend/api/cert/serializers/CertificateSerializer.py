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
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
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