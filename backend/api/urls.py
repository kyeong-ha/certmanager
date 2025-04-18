from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .cert.views.CertificateView import CertificateViewSet
from .edu.views.EducationCenterView import EducationCenterViewSet
from .logs.views.ReissueLogView import ReissueLogViewSet
from .user.views.UserView import UserViewSet

router = DefaultRouter()
router.register(r'cert', CertificateViewSet, basename='cert')
router.register(r'edu', EducationCenterViewSet, basename='edu')
router.register(r'logs', ReissueLogViewSet, basename='logs')
router.register(r'user', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]
