from django.urls import path
from api.user.views import UserListView, UserCreateView, UserDetailView, UserDeleteView, UserSearchByPhoneView

urlpatterns = [
    path('', UserListView.as_view(), name='user-list'),
    path('create/', UserCreateView.as_view(), name='user-create'),
    path('<uuid:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('<uuid:pk>/delete/', UserDeleteView.as_view(), name='user-delete'),
    path('phone/', UserSearchByPhoneView.as_view(), name='user-search-by-phone'),
]
