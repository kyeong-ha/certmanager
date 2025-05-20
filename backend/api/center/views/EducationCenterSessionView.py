from rest_framework import generics
from api.center.models.EducationCenterSession import EducationCenterSession
from api.center.serializers.EducationCenterSessionSerializer import EducationCenterSessionSerializer

class EducationCenterSessionView(generics.RetrieveUpdateAPIView):
    queryset = EducationCenterSession.objects.select_related('education_center').all()
    serializer_class = EducationCenterSessionSerializer
    lookup_field = 'uuid'

# res.data: EducationCenterSession[]
class EducationCenterSessionListView(generics.ListAPIView):
    queryset = EducationCenterSession.objects.select_related('education_center').all()
    serializer_class = EducationCenterSessionSerializer
