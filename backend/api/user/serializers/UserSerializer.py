from rest_framework import serializers
from api.user.models.User import User
from api.center.models.EducationCenterSession import EducationCenterSession
from api.center.serializers.EducationCenterSerializer import EducationCenterSearchSerializer


# 1. 사용자 목록/검색용 Serializer
class UserSearchSerializer(serializers.ModelSerializer):
    """사용자 목록/검색 요약 Serializer"""
class UserSearchSerializer(serializers.ModelSerializer):
    latest_education_session = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['uuid', 'user_name', 'phone_number', 'birth_date', 'latest_education_session']

    def get_latest_education_session(self, obj):
        latest = obj.education_session.order_by('-updated_at', '-created_at').first()
        if latest:
            from api.center.serializers.EducationCenterSessionSerializer import EducationCenterSessionSummarySerializer
            return EducationCenterSessionSummarySerializer(latest).data
        return None


# 2. 사용자 생성 및 수정용 Serializer
class UserWriteSerializer(serializers.ModelSerializer):
    """사용자 생성/수정 Serializer"""
    
    education_session = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=EducationCenterSession.objects.all(),
        required=False
    )

    class Meta:
        model = User
        fields = [
            'uuid',
            'user_id',
            'user_name',
            'birth_date',
            'phone_number',
            'postal_code',
            'address',
            'photo',
            'education_session',
        ]


# 3. 사용자 상세 조회용 Serializer
class UserDetailSerializer(serializers.ModelSerializer):
    """사용자 상세 조회 Serializer"""
    
    from api.center.serializers.EducationCenterSessionSerializer import EducationCenterSessionSummarySerializer
    education_session_list = EducationCenterSessionSummarySerializer(source='education_session', many=True, read_only=True)

    def get_certificates(self, obj):
        from api.cert.serializers.CertificateSerializer import CertificateSearchSerializer
        return CertificateSearchSerializer(obj.certificates.all(), many=True).data

    certificates = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'uuid',
            'user_id',
            'user_name',
            'birth_date',
            'phone_number',
            'postal_code',
            'address',
            'photo',
            'certificates',
            'education_session_list',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
