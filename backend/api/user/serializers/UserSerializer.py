from rest_framework import serializers
from ..models.User import User

class UserSerializer(serializers.ModelSerializer):
    uuid = serializers.ReadOnlyField()
        
    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']