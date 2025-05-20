from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, CreateAPIView, DestroyAPIView
from api.center.models.EducationCenterSession import EducationCenterSession
from api.center.serializers.EducationCenterSessionSerializer import EducationCenterSessionSummarySerializer, EducationCenterSessionWriteSerializer, EducationCenterSessionDetailSerializer

# GET /api/center/session/ → 교육기관 기수 전체 목록 요약조회
class EducationCenterSessionListView(ListAPIView):
    queryset = EducationCenterSession.objects.all()
    serializer_class = EducationCenterSessionSummarySerializer
    
# POST /api/center/session/create → 교육기관 기수 생성
class EducationCenterSessionCreateView(CreateAPIView):
    queryset = EducationCenterSession.objects.all()
    serializer_class = EducationCenterSessionWriteSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        center = data.get('education_center')
        session = data.get('center_session')

        # 이전 기수 배송주소 자동 상속
        if center and session and int(session) > 1:
            prev = EducationCenterSession.objects.filter(
                education_center=center,
                center_session=int(session) - 1
            ).first()
            if prev and not data.get('delivery_address'):
                data['delivery_address'] = prev.delivery_address

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# GET/PUT /api/center/session/<uuid>/ → 단건 상세조회/수정
class EducationCenterSessionDetailView(RetrieveUpdateAPIView):
    queryset = EducationCenterSession.objects.all()
    serializer_class = EducationCenterSessionDetailSerializer

# DELETE /api/center/session/<uuid>/delete → 교육기관 기수 삭제
class EducationCenterSessionDeleteView(DestroyAPIView):
    queryset = EducationCenterSession.objects.all()
    serializer_class = EducationCenterSessionDetailSerializer