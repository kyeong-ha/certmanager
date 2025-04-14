from rest_framework import serializers
from ..models.Certificate import Certificate, EducationCenter
from .EducationCenterSerializer import EducationCenterSerializer
from datetime import datetime

class CertificateSerializer(serializers.ModelSerializer):
    birth_date_input = serializers.CharField(write_only=True, required=False)
    education_center = EducationCenterSerializer(read_only=True)

    class Meta:
        model = Certificate
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def validate_birth_date_input(self, value):
        if len(value) != 6 or not value.isdigit():
            raise serializers.ValidationError("생년월일은 YYMMDD 형식의 숫자여야 합니다.")
        
        year_prefix = '20' if int(value[:2]) <= 30 else '19'
        year = int(year_prefix + value[:2])
        month = int(value[2:4])
        day = int(value[4:6])

        try:
            formatted_date = datetime(year, month, day).date()
        except ValueError:
            raise serializers.ValidationError("생년월일의 월/일이 올바르지 않습니다.")

        return formatted_date

    def validate(self, data):
        if 'birth_date_input' in data:
            data['birth_date'] = data.pop('birth_date_input')
        return data

    # def to_representation(self, instance):
    #     rep = super().to_representation(instance)
    #     rep['birth_date'] = instance.birth_date.strftime("%Y.%m.%d") if instance.birth_date else ""
    #     return rep
