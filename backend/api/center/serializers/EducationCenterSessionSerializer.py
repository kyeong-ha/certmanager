from rest_framework import serializers
from api.center.models.EducationCenterSession import EducationCenterSession
from api.user.serializers.UserSerializer import UserSearchSerializer

# 요약 응답용
class EducationCenterSessionSummarySerializer(serializers.ModelSerializer):
    """교육기관 기수 요약 목록 조회용"""
    class Meta:
        model = EducationCenterSession
        fields = ['uuid', 'center_session', 'unit_price']

    def to_representation(self, instance):
        # 기본 필드 렌더링
        rep = super().to_representation(instance)

        # education_center 수동 직렬화
        center = instance.education_center
        if center:
            rep['education_center'] = {
                'uuid': str(center.uuid),
                'center_name': center.center_name,
                'center_tel': center.center_tel,
                'center_address': center.center_address,
                'ceo_name': center.ceo_name,
                'ceo_mobile': center.ceo_mobile,
            }
        else:
            rep['education_center'] = None

        return rep



# 2. 생성/수정용
class EducationCenterSessionWriteSerializer(serializers.ModelSerializer):
    """교육기관 기수 생성 및 수정용 (UUID 기반)"""
    
    education_center_uuid = serializers.PrimaryKeyRelatedField(
        source='education_center',
        queryset=EducationCenterSession.objects.all()
    )

    class Meta:
        model = EducationCenterSession
        fields = [
            'uuid',
            'education_center_uuid',
            'center_session',
            'unit_price',
            'delivery_address',
            'tracking_numbers',
        ]

class EducationCenterSessionDetailSerializer(serializers.ModelSerializer):
    """교육기관 기수(Session) 상세 조회용"""

    education_center = serializers.SerializerMethodField()
    users            = serializers.SerializerMethodField()
    logs             = serializers.SerializerMethodField()

    class Meta:
        model  = EducationCenterSession
        fields = [
            'uuid', 'education_center', 'center_session',
            'issue_date', 'issue_count', 'issue_status', 'delivery_date',
            'unit_price', 'delivery_address', 'tracking_numbers',
            'users', 'logs',
            'created_at', 'updated_at',
        ]

    # ──────────────────────────────────────────────
    # Lazy import helpers
    # ──────────────────────────────────────────────
    def get_education_center(self, obj):
        from api.center.serializers.EducationCenterSerializer import EducationCenterSearchSerializer
        return EducationCenterSearchSerializer(obj.education_center, context=self.context).data

    def get_users(self, obj):
        """
        소속 Certificate 들의 user 를 **중복 제거**해서 요약 리스트 반환
        """
        # 🪄 지연 import (순환 방지)
        from api.user.serializers.UserSerializer import UserSearchSerializer
        from api.user.models import User  # 커스텀 User 모델 경로에 맞춰 수정

        user_ids = (
            obj.certificates.values_list("user__uuid", flat=True)
            .distinct()
        )
        users = User.objects.filter(uuid__in=user_ids)
        return UserSearchSerializer(users, many=True, context=self.context).data

    def get_logs(self, obj):
        """
        해당 Session 에 속한 Certificate 들의 ReissueLog 전체 집계
        (최신순 정렬)
        """
        # 🪄 지연 import
        from logs.models import ReissueLog
        from api.logs.serializers import ReissueLogSerializer

        qs = (
            ReissueLog.objects.filter(certificate__education_session=obj)
            .select_related("certificate")
            .order_by("-created_at")
        )
        return ReissueLogSerializer(qs, many=True, context=self.context).data