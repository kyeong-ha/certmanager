from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.center.views.EducationCenterView import EducationCenterViewSet

router = DefaultRouter()
router.register('', EducationCenterViewSet, basename='center')

urlpatterns = [
    path('', include(router.urls)), 
]