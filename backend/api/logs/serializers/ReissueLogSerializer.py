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
    certificate = CertificateLogSerializer(read_only=True)

    class Meta:
        model = ReissueLog
        fields = (
            "uuid",
            "certificate",
            "reissue_date",
            "delivery_type",
            "cost",
            "created_at",
        )
        read_only_fields = fields
