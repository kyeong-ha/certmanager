from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.ReissueLogView import ReissueLogSearchView, ReissueLogCreateView, ReissueLogFullSearchView

router = DefaultRouter()

urlpatterns = [
    path('', ReissueLogCreateView.as_view(), name='reissue-log-create'),
    path('<uuid:pk>/', ReissueLogSearchView.as_view(), name='reissue-log-search'),
]