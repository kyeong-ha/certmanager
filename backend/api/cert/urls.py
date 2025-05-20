from django.urls import path
from .views.CertificateListView import CertificateListView
from .views.CertificateDetailView import CertificateDetailView
from .views.CertificateDeleteView import CertificateDeleteView
from .views.CertificateCreateView import create
from .views.CertificateSearchView import search
from .views.CertificateUpdateView import CertificateUpdateByIssueNumberView

urlpatterns = [
    path('', CertificateListView.as_view(), name='cert-list'),
    path('create/', create, name='cert-create'),
    path('<uuid:pk>/', CertificateDetailView.as_view(), name='cert-detail'),
    path('<uuid:pk>/', CertificateDeleteView.as_view(), name='cert-delete'),
    path('search/', search, name='cert-search'),
    path("update/", CertificateUpdateByIssueNumberView.as_view(), name="cert-update-by-issue-number"),
]