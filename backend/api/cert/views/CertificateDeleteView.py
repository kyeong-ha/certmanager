from rest_framework.generics import DestroyAPIView
from api.cert.models.Certificate import Certificate

# DELETE /api/cert/<uuid>/delete → 자격증 삭제
class CertificateDeleteView(DestroyAPIView):
    queryset = Certificate.objects.all()