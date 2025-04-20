from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.logs.views import ReissueLogViewSet

router = DefaultRouter()
router.register(r'', ReissueLogViewSet, basename='reissue-log')


urlpatterns = [
    path('', include(router.urls)), 
]