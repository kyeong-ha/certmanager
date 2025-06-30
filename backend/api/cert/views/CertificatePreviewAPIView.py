from rest_framework.views import APIView
from django.http import HttpResponse, Http404
from api.cert.models.Certificate import Certificate
from api.cert.services.generator import generate_certificate_pdf_bytes

class CertificatePreviewAPIView(APIView):
    """
    Certificate 상세보기 요청 시 임시 PDF를 생성하여 바이트로 반환합니다.
    생성된 파일은 TemporaryDirectory 컨텍스트 종료와 함께 자동 삭제됩니다.
    """
    def get(self, request, uuid):
        try:
            cert = Certificate.objects.get(uuid=uuid)
        except Certificate.DoesNotExist:
            raise Http404("Certificate not found")

        pdf_bytes = generate_certificate_pdf_bytes(cert)
        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{cert.issue_number}.pdf"'
        return response
