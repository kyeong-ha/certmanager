from datetime import timezone
from django.core.exceptions import FieldError
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from api.cert.models.Certificate import Certificate
from api.cert.serializers.CertificateSerializer import CertificateSerializer
from api.edu.models.EducationCenter import EducationCenter
from api.logs.models.ReissueLog import ReissueLog

class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all().order_by('-issue_date')
    serializer_class = CertificateSerializer

    def get_queryset(self):
        filter_type = self.request.query_params.get('filter_type')
        search_value = self.request.query_params.get('search_value')

        if filter_type and search_value:
            try:
                filter_kwargs = {f"{filter_type}__icontains": search_value}
                return Certificate.objects.filter(**filter_kwargs)
            except FieldError:
                return Certificate.objects.none()

        return super().get_queryset()

    @action(detail=False, methods=['post'], url_path='update')
    def update_by_issue_number(self, request):
        filter_data = request.data.get('filter')
        update_data = request.data.get('update_data')

        if not filter_data or 'issue_number' not in filter_data:
            return Response({'error': 'issue_number가 필요합니다.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            certificate = Certificate.objects.get(issue_number=filter_data['issue_number'])

            original_data = CertificateSerializer(certificate).data
            serializer = CertificateSerializer(instance=certificate, data=update_data)

            if serializer.is_valid():
                serializer.save()

                new_data = serializer.data
                changed = original_data != new_data

                if changed:
                    ReissueLog.objects.create(
                        certificate=certificate,
                        reissue_date=timezone.now().date(),
                        delivery_type='선불',
                        reissue_cost=0
                    )

                return Response({'message': '수정 완료 및 로그 기록됨'})

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Certificate.DoesNotExist:
            return Response({'message': '해당 자격증을 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)