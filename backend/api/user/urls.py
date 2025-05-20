from django.urls import path
from .views.UserView import UserListView, UserCreateView, UserDetailView, UserDeleteView

urlpatterns = [
    path('', UserListView.as_view(), name='user-list'),
    path('create', UserCreateView.as_view(), name='user-create'),
    path('<uuid:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('<uuid:pk>/delete', UserDeleteView.as_view(), name='user-delete'),
]
