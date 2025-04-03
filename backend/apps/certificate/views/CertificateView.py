from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.certificate.models.Certificate import Certificate
from ..serializers.CertificateSerializer import CertificateSerializer
from django.core.exceptions import FieldError

@api_view(['GET'])
def search_certificates(request):
    filter_type = request.GET.get('filter_type')
    search_value = request.GET.get('search_value')
    
    if filter_type and search_value:
        try:
            filter_kwargs = {f"{filter_type}__icontains": search_value}
            certificates = Certificate.objects.filter(**filter_kwargs)
        except FieldError:
            return Response({'error': '필터 필드 오류'}, status=400)
    else:
        certificates = Certificate.objects.all()

    serializer = CertificateSerializer(certificates, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
def update_certificate(request):
    filter_data = request.data.get('filter')
    update_data = request.data.get('update_data')

    try:
        certificate = Certificate.objects.get(issue_number=filter_data['issue_number'])
        for key, value in update_data.items():
            setattr(certificate, key, value)
        certificate.save()
        return Response({'message': '수정 완료'})
    except Certificate.DoesNotExist:
        return Response({'message': '해당 자격증을 찾을 수 없습니다.'}, status=404)