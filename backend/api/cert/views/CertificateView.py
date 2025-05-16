from datetime import timezone
from django.core.exceptions import FieldError
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from api.cert.models.Certificate import Certificate
from api.cert.serializers.CertificateSerializer import CertificateSerializer
from api.logs.models.ReissueLog import ReissueLog

class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all().order_by('-issue_date')
    serializer_class = CertificateSerializer

    def get_queryset(self):
        return super().get_queryset()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # 1. Certificate
        cert_serializer = self.get_serializer(instance, data=request.data, partial=True)
        cert_serializer.is_valid(raise_exception=True)
        cert_serializer.save()

        # 2. User
        user_data = request.data.get('user')
        if user_data:
            user = instance.user
            user_fields = [f.name for f in user._meta.fields]  # User모델의 실제 컬럼 목록만 가져옴
            for attr, value in user_data.items():
                if attr in user_fields:
                    setattr(user, attr, value)
            user.save()

        return Response(cert_serializer.data, status=status.HTTP_200_OK)
    
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