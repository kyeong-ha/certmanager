from rest_framework import serializers
from api.user.models.User import User

# 사용자 요약 Serializer
class UserSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['uuid', 'user_name', 'phone_number', 'birth_date']
