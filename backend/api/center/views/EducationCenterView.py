from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, CreateAPIView, DestroyAPIView
from api.center.models.EducationCenter import EducationCenter
from api.center.serializers.EducationCenterSerializer import EducationCenterSearchSerializer, EducationCenterWriteSerializer, EducationCenterDetailSerializer
from rest_framework.pagination import PageNumberPagination

# GET /api/center/ → 교육기관 전체 목록 요약조회
class EducationCenterListView(ListAPIView):
    queryset = EducationCenter.objects.all()
    serializer_class = EducationCenterSearchSerializer 
    pagination_class = PageNumberPagination # 기본 페이지네이션 클래스 설정

# POST /api/center/create → 교육기관 생성
class EducationCenterCreateView(CreateAPIView):
    queryset = EducationCenter.objects.all()
    serializer_class = EducationCenterWriteSerializer

# GET/PUT /api/center/<uuid>/ → 교육기관 조회/수정
class EducationCenterDetailView(RetrieveUpdateAPIView):
    queryset = EducationCenter.objects.all()
    serializer_class = EducationCenterDetailSerializer

# DELETE /api/center/<uuid>/delete → 교육기관 삭제
class EducationCenterDeleteView(DestroyAPIView):
    queryset = EducationCenter.objects.all()
    serializer_class = EducationCenterDetailSerializer