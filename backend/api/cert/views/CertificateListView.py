from rest_framework.generics import ListAPIView
from api.cert.models.Certificate import Certificate
from api.cert.serializers.CertificateSerializer import CertificateSearchSerializer

# GET /api/cert/ → 자격증 전체 목록 요약조회
class CertificateListView(ListAPIView):
    queryset = Certificate.objects.all().order_by('-issue_date')
    serializer_class = CertificateSearchSerializer