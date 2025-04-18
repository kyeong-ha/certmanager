from rest_framework import viewsets
from ..models.ReissueLog import ReissueLog
from ..serializers.ReissueLogSerializer import ReissueLogSerializer

class ReissueLogViewSet(viewsets.ModelViewSet):
    queryset = ReissueLog.objects.all().order_by('-reissue_date')
    serializer_class = ReissueLogSerializer