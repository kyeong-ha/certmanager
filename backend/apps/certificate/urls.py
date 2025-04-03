from django.urls import path
from .views.CertificateView import search_certificates, update_certificate
from apps.certificate.views.CertificateDetailsView import getCertificateDetails

urlpatterns = [
    path('search/', search_certificates),
    path('update/', update_certificate),
    path('<str:issue_number>/', getCertificateDetails),
]