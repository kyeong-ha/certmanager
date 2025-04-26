
from django.urls import path
from .views.DashboardView import CertificateStatsView, RecentCertificatesView

urlpatterns = [
    path('stats/', CertificateStatsView.as_view(), name='dashboard-stats'),
    path('recent/', RecentCertificatesView.as_view(), name='dashboard-recent'),
]