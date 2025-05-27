"""
Certificate 요약 정보를 포함해
프론트에서 issue_number 등을 바로 사용할 수 있도록 함.
"""

from rest_framework import serializers

# ── Local Models ────────────────────────────────────────────────────
from api.logs.models import ReissueLog
from api.cert.models import Certificate

# Certificate 요약용 서브-Serializer
class CertificateLogSerializer(serializers.ModelSerializer):
    """ReissueLog 안에서 쓰이는 Certificate 축약형"""

    class Meta:
        model = Certificate
        fields = (
            "uuid",
            "issue_number",
            "user", 
        )


# ReissueLogSerializer 
class ReissueLogSerializer(serializers.ModelSerializer):
    certificate_uuid = serializers.UUIDField(write_only=True)

    class Meta:
        model = ReissueLog
        fields = (
            "uuid",
            "certificate_uuid",
            "reissue_date",
            "delivery_type",
            "reissue_cost",
            "created_at",
        )
        read_only_fields = ("uuid", "created_at")

    def create(self, validated_data):
        # UUID → 실제 ForeignKey 필드명(certificate_uuid)으로 매핑
        cert_uuid = validated_data.pop("certificate_uuid")
        validated_data["certificate_uuid"] = Certificate.objects.get(uuid=cert_uuid)
        return super().create(validated_data)

    def to_representation(self, instance):
        # 기본 반환값을 받고, certificate_uuid 키를 nested serializer 결과로 덮어쓰기
        ret = super().to_representation(instance)
        ret["certificate_uuid"] = CertificateLogSerializer(instance.certificate_uuid).data
        return ret
