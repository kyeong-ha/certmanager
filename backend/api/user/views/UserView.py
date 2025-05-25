from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, CreateAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from api.user.models.User import User
from api.user.serializers.UserSerializer import UserSearchSerializer, UserWriteSerializer, UserDetailSerializer

# GET /api/user/ → 사용자 목록 요약조회
class UserListView(ListAPIView):
    queryset = User.objects.prefetch_related('education_session')
    serializer_class = UserSearchSerializer

# POST	/api/user/create → 사용자 생성
class UserCreateView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserWriteSerializer

    def create(self, request, *args, **kwargs):
        # 1. 요청 데이터를 serializer에 전달
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 2. education_session 필드를 추출해서 나중에 set()
        education_sessions = serializer.validated_data.pop('education_session', [])

        # 3. User 생성
        user = serializer.save()

        # 4. ManyToMany 관계 수동 연결
        if education_sessions:
            user.education_session.set(education_sessions)

        # 5. 응답 반환
        response_serializer = self.get_serializer(user)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


# GET/PUT /api/user/<uuid>/ → 사용자 상세 조회/수정
class UserDetailView(RetrieveUpdateAPIView):
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserDetailSerializer
        return UserWriteSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

# DELETE /api/user/<uuid>/delete → 사용자 삭제
class UserDeleteView(DestroyAPIView):
    queryset = User.objects.all()