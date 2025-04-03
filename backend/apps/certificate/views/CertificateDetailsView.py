from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from apps.certificate.models.Certificate import Certificate
from apps.certificate.serializers.CertificateDetailsSerializer import CertificateDetailsSerializer

@api_view(['GET'])
def getCertificateDetails(request, issue_number):
    try:
        cert = Certificate.objects.get(issue_number=issue_number)
    except Certificate.DoesNotExist:
        return Response({'error': 'Certificate not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CertificateDetailsSerializer(cert)
    return Response(serializer.data)