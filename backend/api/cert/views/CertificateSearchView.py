from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import FieldError

from api.cert.models.Certificate import Certificate
from api.cert.serializers.CertificateSerializer import CertificateSearchSerializer

# GET /api/cert/search → 자격증 전체 목록 요약조회
@api_view(['GET'])
def search(request):
    filter_type = request.GET.get('filter_type')
    search_value = request.GET.get('search_value')
    center_name = request.GET.get('center_name')
    center_session = request.GET.get('center_session')

    field_map = {
        'user_name': 'user__user_name',
        'birth_date': 'user__birth_date',
        'phone_number': 'user__phone_number',
        'issue_number': 'issue_number',
        'edu_name': 'education_session__education_center__center_name',
        'session': 'education_session__center_session',
    }

    try:
        filters = {}

        if center_name:
            filters['education_session__education_center__center_name__icontains'] = center_name
        if center_session:
            filters['education_session__center_session__icontains'] = center_session
        if filter_type in field_map and search_value:
            filters[field_map[filter_type] + '__icontains'] = search_value

        certificates = Certificate.objects.select_related(
            'user',
            'education_session',
            'education_session__education_center'
        ).filter(**filters).order_by('-issue_date')

        serializer = CertificateSearchSerializer(certificates, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except FieldError:
        return Response({'error': '올바르지 않은 검색 필드입니다.'}, status=status.HTTP_400_BAD_REQUEST)