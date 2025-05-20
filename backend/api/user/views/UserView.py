from rest_framework import viewsets
from ..models.User import User
from ..serializers.UserSerializer import UserSerializer
from ..serializers.UserSearchSerializer import UserSearchSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.prefetch_related(
        'education_sessions__education_center'
    ).all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UserSerializer
        return UserSearchSerializer