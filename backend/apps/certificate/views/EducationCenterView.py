from rest_framework import viewsets
from ..models import EducationCenter
from ..serializers.EducationCenterSerializer import EducationCenterSerializer

class EducationCenterViewSet(viewsets.ModelViewSet):
    queryset = EducationCenter.objects.all().order_by('name')
    serializer_class = EducationCenterSerializer