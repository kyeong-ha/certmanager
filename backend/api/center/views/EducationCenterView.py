from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView
from api.center.models.EducationCenter import EducationCenter
from api.center.serializers.EducationCenterSerializer import EducationCenterSerializer

# 단건 조회/수정 View
class EducationCenterView(RetrieveUpdateAPIView):
    queryset = EducationCenter.objects.all()
    serializer_class = EducationCenterSerializer
    lookup_field = 'uuid'


# 단건 생성 View
class EducationCenterCreateView(CreateAPIView):
    queryset = EducationCenter.objects.all()
    serializer_class = EducationCenterSerializer