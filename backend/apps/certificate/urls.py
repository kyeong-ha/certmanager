from django.urls import path
from rest_framework.routers import DefaultRouter

from .views.CertificateDetailsView import get_user_info

from .views.EducationCenterView import EducationCenterViewSet
from .views.CertificateView import CertificateViewSet

router = DefaultRouter()
router.register(r'cert', CertificateViewSet, basename='cert')
router.register(r'edu', EducationCenterViewSet, basename='edu')

urlpatterns = [
    path('user/', get_user_info), 
]
urlpatterns += router.urls
