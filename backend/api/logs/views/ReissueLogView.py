from rest_framework import viewsets, generics
from ..models.ReissueLog import ReissueLog
from ..serializers.ReissueLogSerializer import ReissueLogSerializer

class ReissueLogFullSearchView(viewsets.ModelViewSet):
    queryset = ReissueLog.objects.all().order_by('-reissue_date')
    serializer_class = ReissueLogSerializer
    
    
class ReissueLogCreateView(generics.ListCreateAPIView):
    queryset = ReissueLog.objects.all().order_by('-reissue_date')
    serializer_class = ReissueLogSerializer

class ReissueLogSearchView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ReissueLog.objects.all().order_by('-reissue_date')
    serializer_class = ReissueLogSerializer
    
    def get_queryset(self):
        qs = ReissueLog.objects.all()
        certificate_uuid = self.request.query_params.get('certificate_uuid')
        if certificate_uuid:
            qs = qs.filter(certificate_uuid=certificate_uuid)
        return qs