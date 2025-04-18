from rest_framework import serializers
from ..models.ReissueLog import ReissueLog

class ReissueLogSerializer(serializers.ModelSerializer):
    uuid = serializers.ReadOnlyField()
        
    class Meta:
        model = ReissueLog
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']