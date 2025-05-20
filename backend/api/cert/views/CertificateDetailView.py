from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from api.cert.models.Certificate import Certificate
from api.user.models.User import User
from api.center.models.EducationCenterSession import EducationCenterSession
from api.cert.serializers.CertificateSerializer import CertificateWriteSerializer, CertificateDetailSerializer
from api.cert.serializers.CertificateSerializer import CertificateDetailSerializer

# GET/PUT /api/cert/<uuid>/ → 자격증 상세조회/수정
class CertificateDetailView(RetrieveUpdateAPIView):
    queryset = Certificate.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CertificateDetailSerializer
        return CertificateWriteSerializer


    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()

        user_uuid = data.get('user')
        session_uuid = data.get('education_session')

        try:
            user = User.objects.get(uuid=user_uuid)
            session = EducationCenterSession.objects.get(uuid=session_uuid)
        except (User.DoesNotExist, EducationCenterSession.DoesNotExist):
            return Response({"error": "User or EducationSession not found."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # 관계 필드 직접 반영 (serializer.save() 후 적용)
        instance.user = user
        instance.education_session = session
        instance.save()

        # 사용자 추가 정보 수정
        user_data = request.data.get('user_data')
        if isinstance(user_data, dict):
            user_fields = [f.name for f in user._meta.fields]
            for attr, value in user_data.items():
                if attr in user_fields:
                    setattr(user, attr, value)
            user.save()

        # 수정된 인스턴스를 다시 전체 직렬화하여 응답
        detail_serializer = CertificateDetailSerializer(instance)
        return Response(detail_serializer.data, status=status.HTTP_200_OK)

