from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from django.utils.timezone import now
from datetime import datetime
from collections import defaultdict

from api.cert.models import Certificate
from api.cert.serializers.CertificateSerializer import CertificateSerializer

class CertificateStatsView(APIView):
    def get(self, request):
        total = Certificate.objects.count()

        # 월별 발급 통계
        monthly_counts = (
            Certificate.objects
            .values('issue_date')
            .order_by('issue_date')
        )

        monthly_result = defaultdict(int)
        for item in monthly_counts:
            date = item['issue_date']
            if date:
                month_key = date.strftime('%Y-%m')
                monthly_result[month_key] += 1

        monthly = [{'month': k, 'count': v} for k, v in sorted(monthly_result.items())]

        # 교육기관별 발급 수
        by_center = (
            Certificate.objects
            .values('education_center__edu_name')
            .annotate(count=Count('uuid'))
            .order_by('-count')
        )
        by_center_data = [
            {'edu_name': item['education_center__edu_name'], 'count': item['count']}
            for item in by_center
        ]

        return Response({
            'total': total,
            'monthly': monthly,
            'by_center': by_center_data
        }, status=status.HTTP_200_OK)

class RecentCertificatesView(APIView):
    def get(self, request):
        recent = Certificate.objects.order_by('-issue_date', '-created_at')[:10]
        serializer = CertificateSerializer(recent, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)