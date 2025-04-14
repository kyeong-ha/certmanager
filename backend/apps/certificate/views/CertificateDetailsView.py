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

@api_view(['GET'])
def get_user_info(request):
    user_name = request.GET.get('user_name')
    birth_date = request.GET.get('birth_date')
    phone_number = request.GET.get('phone_number')

    if not all([user_name, birth_date, phone_number]):
        return Response({'error': '필수 파라미터 누락'}, status=400)

    certificates = Certificate.objects.filter(
        user_name=user_name,
        birth_date=birth_date,
        phone_number=phone_number
    ).order_by('-issue_date')

    result = [
        {
            'user_id': cert.user_id,
            'issue_number': cert.issue_number,
            'course_name': cert.course_name,
            'issue_date': cert.issue_date,
            'issue_type': cert.issue_type,
            'education_center': {
                'id': cert.education_center.id,
                'name': cert.education_center.name,
                'session': cert.education_center.session
            },
            'note': cert.note,
            'postal_code': cert.postal_code,
            'address': cert.address,
            'image_url': cert.image_url.url if cert.image_url else None
        }
        for cert in certificates
    ]
    return Response(result)