from rest_framework import serializers
from django.conf import settings
import json
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
        
    def to_internal_value(self, data):
        # user가 UUID string인지, 객체로 온 것인지 구분
        if 'user' in data and '.' not in 'user':
            # 단순 UUID string → 그대로 전달
            return super().to_internal_value(data)

        # user.xxx 형식인 경우 → dict로 조립
        from collections import defaultdict
        new_data = defaultdict(dict)

        for key, value in data.items():
            if '.' in key:
                prefix, subkey = key.split('.', 1)
                new_data[prefix][subkey] = value
            else:
                new_data[key] = value

        return super().to_internal_value(dict(new_data))

    def create(self, validated_data):
        user_data = validated_data.pop("user")

        # UUID string인 경우: 기존 사용자 연결
        if isinstance(user_data, str):
            try:
                user = User.objects.get(uuid=user_data)
            except User.DoesNotExist:
                raise serializers.ValidationError({"user": "존재하지 않는 사용자 UUID입니다."})

        # dict인 경우: 새 사용자 생성
        elif isinstance(user_data, dict):
            phone = user_data.get("phone_number")
            if not phone:
                raise serializers.ValidationError({"user": "phone_number는 필수입니다."})

            user, _ = User.objects.get_or_create(
                phone_number=phone,
                defaults={
                    "user_name": user_data.get("user_name"),
                    "birth_date": user_data.get("birth_date"),
                    "postal_code": user_data.get("postal_code"),
                    "address": user_data.get("address"),
                    "user_id": user_data.get("user_id"),
                    "photo": user_data.get("photo"),
                }
            )
        else:
            raise serializers.ValidationError({"user": "Invalid user format."})

        # 자격증 생성
        certificate = Certificate.objects.create(user=user, **validated_data)
        return certificate



# 3. 상세 조회용
class CertificateDetailSerializer(serializers.ModelSerializer):
    user = UserSearchSerializer(read_only=True)
    # education_center = EducationCenterSearchSerializer(read_only=True)
    education_session = EducationCenterSessionSummarySerializer(read_only=True)
    copy_file = serializers.SerializerMethodField()

    def get_copy_file(self, obj):
        if obj.copy_file:
            return f"{settings.MEDIA_URL}{obj.copy_file.name}"
        return None
    
                                      
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