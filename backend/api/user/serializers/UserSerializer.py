from rest_framework import serializers
from api.user.models.User import User
from api.center.models.EducationCenterSession import EducationCenterSession
from api.center.serializers.EducationCenterSerializer import EducationCenterSearchSerializer


# 1. 사용자 목록/검색용 Serializer
class UserSearchSerializer(serializers.ModelSerializer):
    """사용자 목록/검색 요약 Serializer"""
    
    class Meta:
        model = User
        fields = ['uuid', 'user_name', 'phone_number', 'birth_date']


# 2. 사용자 생성 및 수정용 Serializer
class UserWriteSerializer(serializers.ModelSerializer):
    """사용자 생성/수정 Serializer"""
    
    education_session = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=EducationCenterSession.objects.all()
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
    
    education_center_list = EducationCenterSearchSerializer(source='education_session', many=True, read_only=True)

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
            'education_center_list',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
