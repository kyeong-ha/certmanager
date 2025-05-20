from rest_framework import serializers
from ..models.EducationCenter import EducationCenter
from ..models.EducationCenterSession import EducationCenterSession

class EducationCenterSerializer(serializers.ModelSerializer):
    uuid = serializers.ReadOnlyField()
    center_session = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = EducationCenter
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        # 1. session 처리 (blank → '-')
        session_name = validated_data.pop('center_session', '').strip() or '-'
        center_name = validated_data.get('center_name')

        # 2. 동일 center_name 존재 여부 확인
        existing_center = EducationCenter.objects.filter(center_name=center_name).first()

        if existing_center:
            # 2.1. 해당 center에 동일 session 존재하는지 확인
            exists_session = EducationCenterSession.objects.filter(
                education_center=existing_center,
                center_session=session_name
            ).exists()

            if not exists_session:
                # session만 추가
                EducationCenterSession.objects.create(
                    education_center=existing_center,
                    center_session=session_name
                )

            # 기존 center 반환 (신규 생성 X)
            return existing_center

        # 3. 신규 center + session 생성
        new_center = EducationCenter.objects.create(**validated_data)
        EducationCenterSession.objects.create(
            education_center=new_center,
            center_session=session_name
        )

        return new_center
