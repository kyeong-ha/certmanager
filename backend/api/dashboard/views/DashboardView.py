from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from django.utils.timezone import now
from datetime import datetime
from collections import defaultdict

from api.cert.models import Certificate
from api.cert.serializers.CertificateSerializer import CertificateSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from django.db.models.functions import TruncMonth

from api.cert.models import Certificate

class CertificateStatsView(APIView):
    def get(self, request):
        total = Certificate.objects.count()

        # 월별 발급 통계
        monthly = (
            Certificate.objects
            .annotate(month=TruncMonth('issue_date'))
            .values('month')
            .annotate(count=Count('uuid'))
            .order_by('month')
        )
        monthly_stats = [
            {'month': item['month'].strftime('%Y-%m'), 'count': item['count']}
            for item in monthly
        ]

        # 교육원별 발급 통계
        center_stats = (
            Certificate.objects
            .values('education_session__education_center__center_name')
            .annotate(count=Count('uuid'))
            .order_by()
        )
        center_stats = [
            {'center_name': item['education_session__education_center__center_name'], 'count': item['count']}
            for item in center_stats
        ]
        
        # 교육원 & 기수별 발급 통계
        center_session_stats = (
             Certificate.objects
            .values('education_session__education_center__center_name', 'education_session__center_session')
            .annotate(count=Count('uuid'))
            .order_by()
        )
        center_session_stats = [
            {
                'center_name': item['education_session__education_center__center_name'],
                'center_session': item['education_session__center_session'],
                'count': item['count']
            }
            for item in center_session_stats
        ]

        # 과정별 발급 통계
        course_stats = (
            Certificate.objects
            .values('course_name')
            .annotate(count=Count('uuid'))
            .order_by()
        )
        course_stats = [
            {'course_name': item['course_name'], 'count': item['count']}
            for item in course_stats
        ]

        return Response({
            'total': total,
            'monthly': monthly_stats,
            'center': center_stats,
            'center_session': center_session_stats,
            'course': course_stats
        }, status=status.HTTP_200_OK)
        

class RecentCertificatesView(APIView):
    def get(self, request):
        recent = Certificate.objects.order_by('-issue_date', '-created_at')[:10]
        serializer = CertificateSerializer(recent, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)