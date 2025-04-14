from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models.Certificate import Certificate
from ..serializers.CertificateSerializer import CertificateSerializer
from django.core.exceptions import FieldError

class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all().order_by('-issue_date')
    serializer_class = CertificateSerializer

    def get_queryset(self):
        filter_type = self.request.query_params.get('filter_type')
        search_value = self.request.query_params.get('search_value')

        if filter_type and search_value:
            try:
                filter_kwargs = {f"{filter_type}__icontains": search_value}
                print(Certificate.objects.filter(**filter_kwargs))
                return Certificate.objects.filter(**filter_kwargs)
            except FieldError:
                return Certificate.objects.none()
        
        return super().get_queryset()
    
    @action(detail=False, methods=['put'], url_path='update-by-issue-number')
    def update_by_issue_number(self, request):
        filter_data = request.data.get('filter')
        update_data = request.data.get('update_data')

        if not filter_data or 'issue_number' not in filter_data:
            return Response({'error': 'issue_number가 필요합니다.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            certificate = Certificate.objects.get(issue_number=filter_data['issue_number'])
            for key, value in update_data.items():
                setattr(certificate, key, value)
            certificate.save()
            return Response({'message': '수정 완료'})
        except Certificate.DoesNotExist:
            return Response({'message': '해당 자격증을 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)