from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import FieldError

from api.cert.models.Certificate import Certificate
from api.cert.serializers.CertificateSerializer import CertificateSerializer

@api_view(['GET'])
def search(request):
    filter_type = request.GET.get('filter_type')
    search_value = request.GET.get('search_value')
    center_name = request.GET.get('center_name')
    center_session = request.GET.get('center_session')

    field_map = {
        'user_name': 'user__user_name',
        'phone_number': 'user__phone_number',
        'issue_number': 'issue_number',
        'education_center': 'education_center__center_name',
    }

    try:
        if center_name:
            filters = {'education_center__center_name__icontains': center_name}
            if center_session:
                filters['education_center__session__icontains'] = center_session
            certificates = Certificate.objects.select_related('user', 'education_center') \
                .filter(**filters).order_by('-issue_date')

        elif filter_type in field_map and search_value:
            filter_key = f"{field_map[filter_type]}__icontains"
            certificates = Certificate.objects.select_related('user', 'education_center') \
                .filter(**{filter_key: search_value}).order_by('-issue_date')

        else:
            certificates = Certificate.objects.select_related('user', 'education_center').all()

        serializer = CertificateSerializer(certificates, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except FieldError:
        return Response({'error': '올바르지 않은 검색 필드입니다.'}, status=status.HTTP_400_BAD_REQUEST)