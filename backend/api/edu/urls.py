from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.edu.views.EducationCenterView import EducationCenterViewSet

router = DefaultRouter()
router.register('', EducationCenterViewSet, basename='edu')

urlpatterns = [
    path('', include(router.urls)), 
]