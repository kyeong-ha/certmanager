from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import timezone
from api.cert.models.Certificate import Certificate
from api.logs.models.ReissueLog import ReissueLog
from api.cert.serializers.CertificateSerializer import CertificateWriteSerializer, CertificateDetailSerializer

# POST /api/cert/update → 발급번호 기준 수정 + 재발급 로그 생성 
class CertificateUpdateByIssueNumberView(APIView):
    """
    POST /api/cert/update
    → issue_number 기준 자격증 수정 및 변경 시 재발급 로그 기록
    """
    
    def post(self, request):
        filter_data = request.data.get("filter")
        update_data = request.data.get("update_data")

        if not filter_data or "issue_number" not in filter_data:
            return Response(
                {"error": "issue_number가 필요합니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            certificate = Certificate.objects.get(issue_number=filter_data["issue_number"])

            original_data = CertificateDetailSerializer(certificate).data

            serializer = CertificateWriteSerializer(certificate, data=update_data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            new_data = CertificateDetailSerializer(certificate).data

            if original_data != new_data:
                ReissueLog.objects.create(
                    certificate=certificate,
                    reissue_date=timezone.now().date(),
                    delivery_type="선불",
                    reissue_cost=0,
                )

            return Response(
                {
                    "message": "수정 완료 및 로그 기록됨",
                    "original": original_data,
                    "updated": new_data,
                },
                status=status.HTTP_200_OK,
            )

        except Certificate.DoesNotExist:
            return Response(
                {"error": "해당 자격증을 찾을 수 없습니다."},
                status=status.HTTP_404_NOT_FOUND,
            )