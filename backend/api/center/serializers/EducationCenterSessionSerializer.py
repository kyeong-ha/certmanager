from rest_framework import serializers
from api.center.models.EducationCenterSession import EducationCenterSession
from api.user.serializers.UserSerializer import UserSearchSerializer
from api.center.serializers.EducationCenterSerializer import EducationCenterSearchSerializer
from api.logs.serializers.ReissueLogSerializer import ReissueLogSerializer

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

    education_center = EducationCenterSearchSerializer(read_only=True)
    users = UserSearchSerializer(many=True, read_only=True)
    logs = ReissueLogSerializer(many=True, read_only=True)

    class Meta:
        model = EducationCenterSession
        fields = [
            'uuid',
            'center_session',
            'education_center',
            'delivery_address',
            'tracking_numbers',
            'unit_price',
            'issue_status',
            'issue_count',
            'issue_date',
            'delivery_date',
            'users',
            'logs',
            'created_at',
            'updated_at',
        ]