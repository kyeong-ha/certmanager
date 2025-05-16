from django.urls import path
from api.center.views.EducationCenterView import EducationCenterView, EducationCenterCreateView
from api.center.views.EducationCenterSessionView import EducationCenterSessionView, EducationCenterSessionListView

urlpatterns = [
    # GET /api/center/ → DropDown용 교육기관+세션 리스트
    path('', EducationCenterSessionListView.as_view(), name='center-list'),
    
    # POST /api/center/create →  EducationCenter 단건 생성
    path('create/', EducationCenterCreateView.as_view(), name='center-create'),

    # GET/PUT /api/center/<uuid>/ → EducationCenter 단건 조회/수정
    path('<uuid:uuid>/', EducationCenterView.as_view(), name='center-detail'),

    # GET /api/center/session/ → EducationCenterSession 전체 목록 조회
    path('session/', EducationCenterSessionListView.as_view(), name='session-list'),

    # GET/PUT /api/center/session/<uuid>/ → EducationCenterSession 단건 조회/수정
    path('session/<uuid:uuid>/', EducationCenterSessionView.as_view(), name='session-detail'),
]
