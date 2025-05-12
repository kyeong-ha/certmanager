from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.cert.views.CertificateView import CertificateViewSet
from api.cert.views.searchView import search
from api.cert.views.createView import create

router = DefaultRouter()
router.register('', CertificateViewSet, basename='cert')

urlpatterns = [
    path('create/', create, name='create'),
    path('search/', search, name='search'),
    path('', include(router.urls)), 
]