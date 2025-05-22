from rest_framework import serializers
from api.center.models.EducationCenterSession import EducationCenterSession

# 요약 응답용
class EducationCenterSessionSummarySerializer(serializers.ModelSerializer):
    """교육기관 기수 요약 목록 조회용"""

    def get_fields(self):
        from api.center.serializers.EducationCenterSerializer import EducationCenterSearchSerializer
        fields = super().get_fields()
        fields['education_center'] = EducationCenterSearchSerializer(read_only=True)
        return fields

    class Meta:
        model = EducationCenterSession
        fields = ['uuid', 'center_session', 'education_center', 'unit_price']

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

# 3. 상세 조회용
class EducationCenterSessionDetailSerializer(serializers.ModelSerializer):
    """교육기관 기수 상세 조회용"""

    def get_fields(self):
        from api.center.serializers.EducationCenterSerializer import EducationCenterSearchSerializer
        fields = super().get_fields()
        fields['education_center'] = EducationCenterSearchSerializer(read_only=True)
        return fields

    class Meta:
        model = EducationCenterSession
        fields = [
            'uuid',
            'education_center',
            'center_session',
            'unit_price',
            'delivery_address',
            'tracking_numbers',
            'created_at',
            'updated_at',
        ]
