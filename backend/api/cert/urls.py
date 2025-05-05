from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.cert.views.CertificateView import CertificateViewSet
from api.cert.views.searchView import search

router = DefaultRouter()
router.register('', CertificateViewSet, basename='cert')

urlpatterns = [
    path('search/', search, name='search-certificates'),
    path('', include(router.urls)), 
]