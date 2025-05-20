from rest_framework import serializers
from ..models.EducationCenter import EducationCenter
from ..models.EducationCenterSession import EducationCenterSession

# 1. 목록 조회용 (요약용)
class EducationCenterSearchSerializer(serializers.ModelSerializer):
    """교육기관 목록/검색 요약용"""
    
    class Meta:
        model = EducationCenter
        fields = ['uuid', 'center_name', 'center_tel']  # 기본 요약 필드

# 2. 생성/수정용
class EducationCenterWriteSerializer(serializers.ModelSerializer):
    """교육기관 생성/수정용 - center_session(기수)까지 입력"""
    
    uuid = serializers.ReadOnlyField()
    center_session = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = EducationCenter
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        """
        center_name이 존재할 경우 재사용하고,
        전달된 center_session이 없으면 '-' 세션을 생성
        """
        session_name = validated_data.pop('center_session', '').strip() or '-'
        center_name = validated_data.get('center_name')

        # 기존 center 존재시 session만 추가
        existing_center = EducationCenter.objects.filter(center_name=center_name).first()
        if existing_center:
            exists_session = EducationCenterSession.objects.filter(
                education_center=existing_center,
                center_session=session_name
            ).exists()

            if not exists_session:
                EducationCenterSession.objects.create(
                    education_center=existing_center,
                    center_session=session_name
                )
            return existing_center

        # 신규 center + session 생성
        new_center = EducationCenter.objects.create(**validated_data)
        EducationCenterSession.objects.create(
            education_center=new_center,
            center_session=session_name
        )
        return new_center

# 3. 상세 조회용 (read 전용)
class EducationCenterDetailSerializer(serializers.ModelSerializer):
    """교육기관 상세 조회용"""

    class Meta:
        model = EducationCenter
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
