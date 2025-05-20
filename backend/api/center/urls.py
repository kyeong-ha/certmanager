from django.urls import path
from .views.EducationCenterView import  EducationCenterListView, EducationCenterCreateView, EducationCenterDetailView, EducationCenterDeleteView
from .views.EducationCenterSessionView import EducationCenterSessionListView, EducationCenterSessionCreateView, EducationCenterSessionDetailView, EducationCenterSessionDeleteView

urlpatterns = [
    # EducationCenter
    path('', EducationCenterListView.as_view(), name='center-list'),
    path('create/', EducationCenterCreateView.as_view(), name='center-create'),
    path('<uuid:pk>/', EducationCenterDetailView.as_view(), name='center-detail'),
    path('<uuid:pk>/delete', EducationCenterDeleteView.as_view(), name='center-delete'),

    # EducationCenterSession
    path('session/', EducationCenterSessionListView.as_view(), name='center-session-list'),
    path('session/create', EducationCenterSessionCreateView.as_view(), name='center-session-create'),
    path('session/<uuid:pk>/', EducationCenterSessionDetailView.as_view(), name='center-session-detail'),
    path('session/<uuid:pk>/delete', EducationCenterSessionDeleteView.as_view(), name='center-session-delete'),
]
